import type { Stripe } from "stripe";
import { stripe } from ".";
import { PlanSchema } from "@/features/billing/schema/create-billing-schema";

interface createStripeCheckoutParams {
  teamId: string;
  customerId?: string;
  customerEmail?: string;
  plan: PlanSchema;
  variantQuantities: Array<{
    quantity: number;
    variantId: string;
  }>;
  returnUrl: string;
  metadata: Record<string, string>;
  embedded: boolean;
}

export default async function createStripeCheckout(
  params: createStripeCheckoutParams
) {
  const clientReferenceId = params.teamId;

  const customer = params.customerId || undefined;

  const mode: Stripe.Checkout.SessionCreateParams.Mode =
    params.plan.paymentType === "recurring" ? "subscription" : "payment";

  const isSubscription = mode === "subscription";

  // const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
  //   quantity: 1,
  //   price: params.priceId,
  // };

  const lineItem = params.plan.lineItems.map((item) => {
    if (item.type === "metered") {
      return {
        price: item.id,
      };
    }

    const quantity =
      params.variantQuantities.find((variant) => {
        return variant.variantId === item.id;
      })?.quantity ?? 1;

    return {
      price: item.id,
      quantity,
    };
  });

  const customerData = customer
    ? {
        customer,
      }
    : {
        customer_email: params.customerEmail,
      };

  const customerCreation =
    isSubscription || customer
      ? ({} as Record<string, string>)
      : { customer_creation: "always" };

  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData =
    {
      metadata: {
        teamId: params.teamId,
        ...(params.metadata ?? {}),
      },
    };

  const urls = getUrls({
    returnUrl: params.returnUrl,
    embedded: params.embedded,
  });

  const uiMode = params.embedded ? "embedded" : "hosted";

  return stripe.checkout.sessions.create({
    mode,
    ui_mode: uiMode,
    line_items: lineItem,
    client_reference_id: clientReferenceId,
    subscription_data: subscriptionData,
    ...customerCreation,
    ...customerData,
    ...urls,
  });
}

function getUrls(params: { returnUrl: string; embedded?: boolean }) {
  const successUrl = `${params.returnUrl}?success=true`;
  const cancelUrl = `${params.returnUrl}?cancel=true`;
  //TODO: Embeded checkout
  const returnUrl = `${params.returnUrl}/return?session_id={CHECKOUT_SESSION_ID}`;

  return params.embedded
    ? {
        return_url: returnUrl,
      }
    : {
        success_url: successUrl,
        cancel_url: cancelUrl,
      };
}
