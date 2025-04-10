import { db } from "@/lib/db";
import {
  billingCustomers,
  subscriptionItems,
  subscriptions,
} from "@/lib/db/schema/billing";
import { and, eq, notInArray } from "drizzle-orm";
import Stripe from "stripe";
import { getLineItemTypeById } from "../../schema/create-billing-schema";
import billingConfig from "@/config/billing";

interface UpsertSubscriptionParams {
  teamId: string;
  customerId: string;
  subscription: Stripe.Subscription;
}

export async function upsertSubscription({
  teamId,
  customerId,
  subscription,
}: UpsertSubscriptionParams) {
  return await db.transaction(async (tx) => {
    const [billingCustomer] = await tx
      .insert(billingCustomers)
      .values({
        teamId,
        customerId,
      })
      .onConflictDoUpdate({
        target: [billingCustomers.teamId, billingCustomers.customerId],
        set: {
          updatedAt: new Date(),
        },
      })
      .returning({
        id: billingCustomers.id,
      });

    const active =
      subscription.status === "active" || subscription.status === "trialing";

    const [subscriptionData] = await tx
      .insert(subscriptions)
      .values({
        teamId,
        billingCustomerId: billingCustomer.id,
        id: subscription.id,
        active,
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
