import {
  Platform,
  UserFieldsFragment,
  useCompletePurchaseV2Mutation,
} from "@/graphql/generated";
import { ErrorCode, Purchase, SubscriptionProduct, useIAP } from "expo-iap";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User, useUserContext } from "./UserContext";

export const IAP_PRODUCT_ID_V1 = "premium.monthly.v1";
export const IAP_PRODUCT_IDS = [IAP_PRODUCT_ID_V1];

export interface TPurchaseContext {
  subscriptions: SubscriptionProduct[];
  premiumSubscription?: SubscriptionProduct;
  purchasing: boolean;
  initiatePurchase: (product: SubscriptionProduct) => Promise<void>;
}

export const PurchaseContext = createContext<TPurchaseContext>(
  undefined as unknown as TPurchaseContext
);

export function usePurchaseContext() {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error(
      "usePurchaseContext must be used within a PurchaseContextProvider"
    );
  }
  return context;
}

export const PurchaseContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { actions: userActions, user } = useUserContext();
  const [completePurchaseV2] = useCompletePurchaseV2Mutation();

  // true when the purchase is initiated and false after purchase in app store succeeds
  const [isProcessing, setIsProcessing] = useState(false);
  // after a purchase is successful in the app store, we have to validate the receipt and record the purchase. This stores the state of that.
  const [isPostProcessing, setIsPostProcessing] = useState(false);

  const {
    connected,
    subscriptions,
    requestProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      try {
        console.info(
          "onPurchaseSuccess called",
          purchase.id,
          purchase.transactionId
        );

        const productBeingPurchased = subscriptions.find(
          (sub) => sub.id === purchase.productId
        );
        if (!productBeingPurchased) {
          throw new Error("invariant: error finding product for purchase");
        }
        setIsProcessing(false);
        setIsPostProcessing(true);

        console.info("Completing purchase on server");
        const recordResponse = await completePurchaseOnServer(
          purchase,
          productBeingPurchased,
          user,
          completePurchaseV2
        );

        if (!recordResponse.isSuccess) {
          console.log(recordResponse);
          console.error("Error completing purchase");
          return;
        }

        // After successful server validation and recording, finish the transaction with the app stores
        console.info("Finishing transaction with app store");
        const finishResult = await finishTransaction({ purchase });
        console.info("Finished transaction", finishResult);
        userActions.onPurchaseComplete(recordResponse.user);
      } catch (error) {
        console.error("Unknown error in onPurchaseSuccess", error);
      } finally {
        setIsProcessing(false);
        setIsPostProcessing(false);
      }
    },

    onPurchaseError: (error) => {
      setIsProcessing(false);

      if (
        error.code === ErrorCode.E_USER_CANCELLED ||
        error.code === ErrorCode.E_DEFERRED_PAYMENT ||
        error.code === "E_ALREADY_OWNED"
      ) {
        // no issue, normal user behavior
        return;
      }
      console.error("onPurchaseError called", error);
    },

    onSyncError: (error) => {
      console.error("onSyncError called", error);
    },
  });

  // Load subscriptions when component mounts
  useEffect(() => {
    if (!connected) return;
    requestProducts({ skus: IAP_PRODUCT_IDS, type: "subs" });
  }, [connected, requestProducts]);

  const initiatePurchase = useCallback(
    async (product: SubscriptionProduct) => {
      console.info(
        "Initiating purchase for ",
        product.id,
        product.displayName,
        product.platform
      );
      setIsProcessing(true);

      console.info("Requesting purchase with app store");
      await requestPurchase({
        request: {
          ios: {
            sku: product.id,
            quantity: 1,
          },
          android: {
            skus: [product.id],
          },
        },
        type: "inapp",
      });
    },
    [requestPurchase]
  );

  const providerValue: TPurchaseContext = useMemo(
    () => ({
      initiatePurchase,
      subscriptions,
      premiumSubscription: subscriptions.find(
        (s) => s.id === IAP_PRODUCT_ID_V1
      ),
      purchasing: isProcessing || isPostProcessing,
    }),
    [initiatePurchase, subscriptions, isProcessing, isPostProcessing]
  );

  return (
    <PurchaseContext.Provider value={providerValue}>
      {children}
    </PurchaseContext.Provider>
  );
};

async function completePurchaseOnServer(
  purchase: Purchase,
  product: SubscriptionProduct,
  user: User,
  completePurchaseV2Mutation: ReturnType<
    typeof useCompletePurchaseV2Mutation
  >[0]
): Promise<
  | {
      isSuccess: true;
      user: UserFieldsFragment;
    }
  | { isSuccess: false }
> {
  try {
    if (!product.price) {
      throw new Error("invariant, no price");
    }
    if (!purchase.transactionId) {
      throw new Error("invariant, no transactionId");
    }
    if (!purchase.purchaseToken) {
      throw new Error("invariant, no purchaseToken");
    }
    if (!user.isLoggedIn) {
      throw new Error("invariant, user not logged in");
    }

    const response = await completePurchaseV2Mutation({
      variables: {
        input: {
          platform:
            purchase.platform === "ios" ? Platform.Ios : Platform.Android,
          transactionId: purchase.transactionId,
          purchaseToken: purchase.purchaseToken,
          priceCents: Math.ceil(product.price * 100),
        },
      },
      context: {
        headers: { authorization: `Bearer ${user.idToken}` },
      },
    });

    if (response.data?.completePurchaseV2) {
      return {
        isSuccess: response.data.completePurchaseV2.isComplete,
        user: response.data.completePurchaseV2.user!,
      };
    }

    return {
      isSuccess: false,
    };
  } catch (error) {
    console.error("Error completing purchase on server:", error);
    return {
      isSuccess: false,
    };
  }
}
