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
      const timestamp = new Date().toISOString();
      try {
        const { id, transactionId, productId, platform } = purchase;
        console.info(`[${timestamp} ${id}] onPurchaseSuccess called`, {
          id,
          transactionId,
          productId,
          transactionReasonIOS:
            platform === "ios" && purchase.transactionReasonIOS,
        });

        // Check if this is an iOS renewal transaction - skip server processing but still finish
        if (
          purchase.platform === "ios" &&
          purchase.transactionReasonIOS !== "PURCHASE"
        ) {
          console.info(
            `[${timestamp} ${id}] Skipping non-purchase transaction: ${purchase.transactionId}`
          );
          console.info(
            `[${timestamp} ${id}] Finishing non-purchase transaction with app store`
          );
          const finishResult = await finishTransaction({ purchase });
          console.info(
            `[${timestamp} ${id}] Finished non-purchase transaction result:`,
            finishResult
          );
          return;
        }

        const productBeingPurchased = subscriptions.find(
          (sub) => sub.id === purchase.productId
        );
        if (!productBeingPurchased) {
          console.error(
            `[${timestamp} ${id}] Error: Product not found for productId: ${purchase.productId}`
          );
          return;
        }

        setIsProcessing(false);
        setIsPostProcessing(true);

        console.info(
          `[${timestamp} ${id}] Starting completePurchaseOnServer call`
        );
        const recordResponse = await completePurchaseOnServer(
          purchase,
          productBeingPurchased,
          user,
          completePurchaseV2
        );
        console.info(
          `[${timestamp} ${id}] completePurchaseOnServer response:`,
          {
            isSuccess: recordResponse.isSuccess,
          }
        );

        if (!recordResponse.isSuccess) {
          console.error(
            `[${timestamp} ${id}] Error completing purchase on server:`,
            recordResponse
          );
          return;
        }

        // After successful server validation and recording, finish the transaction with the app stores
        console.info(
          `[${timestamp} ${id}] Starting finishTransaction with app store`
        );
        const finishResult = await finishTransaction({ purchase });
        console.info(
          `[${timestamp} ${id}] Finished transaction result:`,
          finishResult
        );
        userActions.onPurchaseComplete(recordResponse.user);
      } catch (error) {
        console.error(
          `[${timestamp}] Unknown error in onPurchaseSuccess:`,
          error
        );
      } finally {
        console.info(
          `[${timestamp}] onPurchaseSuccess cleanup - setting processing states to false`
        );
        setIsProcessing(false);
        setIsPostProcessing(false);
      }
    },

    onPurchaseError: (error) => {
      const timestamp = new Date().toISOString();
      setIsProcessing(false);

      if (
        error.code === ErrorCode.E_USER_CANCELLED ||
        error.code === ErrorCode.E_DEFERRED_PAYMENT ||
        error.code === "E_ALREADY_OWNED"
      ) {
        console.info(
          `[${timestamp}] Purchase cancelled/deferred/already owned:`,
          error.code
        );
        return;
      }
      console.error(`[${timestamp}] onPurchaseError called:`, error);
    },

    onSyncError: (error) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] onSyncError called:`, error);
    },
  });

  // Load subscriptions when component mounts
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.info(
      `[${timestamp}] IAP connected, requesting products:`,
      IAP_PRODUCT_IDS
    );
    requestProducts({ skus: IAP_PRODUCT_IDS, type: "subs" });
  }, [connected, requestProducts]);

  const initiatePurchase = useCallback(
    async (product: SubscriptionProduct) => {
      const timestamp = new Date().toISOString();
      console.info(
        `[${timestamp}] Initiating purchase for ${product.id} - ${product.displayName} (${product.platform})`
      );
      setIsProcessing(true);

      console.info(`[${timestamp}] Requesting purchase with app store`);
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
  const timestamp = new Date().toISOString();
  console.info(
    `[${timestamp}] completePurchaseOnServer called for transaction: ${purchase.transactionId}`
  );

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

    console.info(
      `[${timestamp}] Making GraphQL mutation call to completePurchaseV2`
    );
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
    console.info(
      `[${timestamp}] GraphQL mutation completed, response received`
    );

    if (response.data?.completePurchaseV2) {
      console.info(
        `[${timestamp}] Server response: isComplete = ${response.data.completePurchaseV2.isComplete}`
      );
      return {
        isSuccess: response.data.completePurchaseV2.isComplete,
        user: response.data.completePurchaseV2.user!,
      };
    }

    console.warn(`[${timestamp}] No data in response from completePurchaseV2`);
    return {
      isSuccess: false,
    };
  } catch (error) {
    console.error(`[${timestamp}] Error completing purchase on server:`, error);
    return {
      isSuccess: false,
    };
  }
}
