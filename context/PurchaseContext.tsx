import { UserFieldsFragment } from "@/graphql/generated";
import { ErrorCode, Purchase, SubscriptionProduct, useIAP } from "expo-iap";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUserContext } from "./UserContext";

export const IAP_PRODUCT_ID_V1 = "premium.monthly.v1";
export const IAP_PRODUCT_IDS = [IAP_PRODUCT_ID_V1];

export interface TPurchaseContext {
  subscriptions: SubscriptionProduct[];
  premiumSubscription?: SubscriptionProduct;
  purchasing: boolean;
  initiatePurchase: (product: SubscriptionProduct) => Promise<void>;
  purchaseResultMessage: string; // temporary: remove after testing
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
  const { actions: userActions } = useUserContext();

  // true when the purchase is initiated and false after purchase in app store succeeds
  const [isProcessing, setIsProcessing] = useState(false);
  // after a purchase is successful in the app store, we have to validate the receipt and record the purchase. This stores the state of that.
  const [isPostProcessing, setIsPostProcessing] = useState(false);
  // temporary for debugging. todo remove this
  const [purchaseResultMessage, setPurchaseResultMessage] = useState("");

  const {
    connected,
    subscriptions,
    requestProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      try {
        console.info("onPurchaseSuccess called");
        setIsProcessing(false);
        setPurchaseResultMessage(
          `✅ Purchase successful (${purchase.platform})\n` +
            `Product: ${purchase.productId}\n` +
            `Transaction ID: ${purchase.transactionId || "N/A"}\n` +
            `Date: ${new Date(
              purchase.transactionDate
            ).toLocaleDateString()}\n` +
            `Receipt: ${purchase.transactionReceipt?.substring(0, 50)}...`
        );
        setIsPostProcessing(true);

        console.info("Validating receipt");
        const isValidReceipt = await validateReceiptOnServer(purchase);
        if (!isValidReceipt) {
          // todo
          console.error("Invalid receipt");
          return;
        }

        console.info("Recording purchase");
        const recordResponse = await recordPurchaseOnServer(purchase);

        if (!recordResponse.isSuccess) {
          // todo
          console.error("Error recording purchase");
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

      setPurchaseResultMessage(`❌ Purchase failed: ${error.message}`);
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
      setPurchaseResultMessage("Processing purchase...");

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
      purchaseResultMessage,
    }),
    [
      initiatePurchase,
      subscriptions,
      isProcessing,
      isPostProcessing,
      purchaseResultMessage,
    ]
  );

  return (
    <PurchaseContext.Provider value={providerValue}>
      {children}
    </PurchaseContext.Provider>
  );
};

// TODO:ACTUALLY VALIDATE RECEIPT ON BACKEND
async function validateReceiptOnServer(purchase: Purchase) {
  return true;
}

// TODO:ACTUALLY RECORD PURCHASE ON BACKEND
async function recordPurchaseOnServer(purchase: Purchase): Promise<{
  isSuccess: boolean;
  user: UserFieldsFragment;
}> {
  // todo: return actual response from backend
  return {
    isSuccess: true,
    user: {
      id: "123",
      createdAt: "111",
      entitledToPremium: true,
      name: "Foo Bar",
    },
  };
}
