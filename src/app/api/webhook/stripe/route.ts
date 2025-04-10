import { headers } from "next/headers";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { upsertSubscription } from "@/features/billing/server/action/upsert-subscription";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema/billing";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        await onCheckoutCompleted(session, subscription);

        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await onSubscriptionUpdated(subscription);

        break;
      }
      case "customer.subscription.deleted": {
        const subscriptionId = event.data.object.id as string;

        await onSubscriptionDeleted(subscriptionId);

        break;
      }
    }
  } catch (error) {
    console.log("Error in webhook handler", error);
    return new Response(`Webhook Error: ${error}`, { status: 400 });
  }

  return new Response(null, { status: 200 });
}

async function onSubscriptionUpdated(subscription: Stripe.Subscription) {
  const teamId = subscription.metadata.teamId as string;
  const customerId = subscription.customer as string;

  await upsertSubscription({ teamId, customerId, subscription });
}

async function onSubscriptionDeleted(subscriptionId: string) {
  await db.delete(subscriptions).where(eq(subscriptions.id, subscriptionId));
}

async function onCheckoutCompleted(
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription
) {
  const teamId = session.client_reference_id as string;
  const customerId = session.customer as string;

  await upsertSubscription({ teamId, customerId, subscription });
}
