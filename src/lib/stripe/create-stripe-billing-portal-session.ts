import { stripe } from ".";

interface createStripeBillingPortalSessionParams {
  customerId: string;
  returnUrl: string;
}

export async function createStripeBillingPortalSession(
  params: createStripeBillingPortalSessionParams
) {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId!,
    return_url: params.returnUrl,
  });
}
