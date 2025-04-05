import { headers } from "next/headers";
import { and, eq, notInArray } from "drizzle-orm";
import Stripe from "stripe";

import { getLineItemTypeById } from "@/features/billing/schema/create-billing-schema";
import { db } from "@/lib/db";
import {
  billingCustomers,
  subscriptionItems,
  subscriptions,
} from "@/lib/db/schema/billing";
import { stripe } from "@/lib/stripe";
import billingConfig from "@/config/billing";

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
    }
  } catch (error) {
    console.log("Error in webhook handler", error);
    return new Response(`Webhook Error: ${error}`, { status: 400 });
  }

  return new Response(null, { status: 200 });
}

async function onCheckoutCompleted(
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription
) {
  const teamId = session.client_reference_id as string;
  const customerId = session.customer as string;

  await db.transaction(async (tx) => {
    const [billingCustomer] = await tx
      .insert(billingCustomers)
      .values({
        teamId,
        customerId,
      })
      .returning({
        id: billingCustomers.id,
      });

    const [subscriptionData] = await tx
      .insert(subscriptions)
      .values({
        teamId,
        billingCustomerId: billingCustomer.id,
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        currency: subscription.currency,
      })
      .onConflictDoUpdate({
        target: subscriptions.id,
        set: {
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodStart: new Date(
            subscription.current_period_start * 1000
          ),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          currency: subscription.currency,
        },
      })
      .returning();

    const existingItemIds = subscription.items.data.map((item) => item.id);

    await tx
      .delete(subscriptionItems)
      .where(
        and(
          eq(subscriptionItems.subscriptionId, subscriptionData.id),
          notInArray(subscriptionItems.id, existingItemIds)
        )
      );

    for (const item of subscription.items.data) {
      const variantId = item.price?.id as string;
      const type = getLineItemTypeById(billingConfig, variantId);

      await tx
        .insert(subscriptionItems)
        .values({
          id: item.id,
          subscriptionId: subscriptionData.id,
          productId: item.price?.product as string,
          variantId,
          type,
          quantity: item.quantity,
          price: item.price?.unit_amount as number,
          interval: item.price?.recurring?.interval as string,
          intervalCount: item.price?.recurring?.interval_count as number,
        })
        .onConflictDoUpdate({
          target: subscriptionItems.id,
          set: {
            productId: item.price?.product as string,
            variantId,
            type,
            quantity: item.quantity,
            price: item.price?.unit_amount as number,
            interval: item.price?.recurring?.interval as string,
            intervalCount: item.price?.recurring?.interval_count as number,
          },
        });
    }
  });
}
