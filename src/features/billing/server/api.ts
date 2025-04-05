import { db } from "@/lib/db";

export async function getCustomerId(teamId: string) {
  const data = await db.query.billingCustomers.findFirst({
    columns: {
      customerId: true,
    },
    where: (billingCustomers, { eq }) => eq(billingCustomers.teamId, teamId),
  });

  return data?.customerId;
}

export async function getSubscription(teamId: string) {
  const data = await db.query.subscriptions.findFirst({
    with: {
      subscriptionItems: true,
    },
    where: (subscriptions, { eq }) => eq(subscriptions.teamId, teamId),
  });

  if (!data) return null;

  return data;
}