import { pricingData } from "@/config/billing";
import { db } from "@/lib/db/index";
import { subscriptions } from "@/lib/db/schema/billing";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe/index";

export async function getUserSubscriptionPlan(teamId: string) {
  if (!teamId) {
    throw new Error("Team not found.");
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.teamId, teamId));

  if (!subscription)
    return {
      id: undefined,
      name: undefined,
      description: undefined,
      stripePriceId: undefined,
      price: undefined,
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      stripeCustomerId: null,
      isSubscribed: false,
      isCanceled: false,
    };

  return

  // const isSubscribed =
  //   subscription.priceId &&
  //   subscription.currentPeriodEnd &&
  //   subscription.currentPeriodEnd.getTime() + 86_400_000 > Date.now();

  // const plan = isSubscribed
  //   ? pricingData.find(
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       (plan: any) => plan.stripePriceId === subscription.priceId
  //     )
  //   : null;

  // let isCanceled = false;
  // if (isSubscribed && subscription.subscriptionId) {
  //   const stripePlan = await stripe.subscriptions.retrieve(
  //     subscription.subscriptionId
  //   );
  //   isCanceled = stripePlan.cancel_at_period_end;
  // }

  // return {
  //   ...plan,
  //   stripeSubscriptionId: subscription.subscriptionId,
  //   stripeCurrentPeriodEnd: subscription.currentPeriodEnd,
  //   stripeCustomerId: subscription.customerId,
  //   isSubscribed,
  //   isCanceled,
  // };
}
