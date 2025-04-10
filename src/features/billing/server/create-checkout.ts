"use server";

import { z } from "zod";
import { LineItemSchema } from "../schema/create-billing-schema";
import * as teamApi from "@/features/team/server/api";
import * as billingApi from "@/features/billing/server/api";
import { CheckoutSchema } from "../schema/checkout-schema";
import billingConfig from "@/config/billing";
import createStripeCheckout from "@/lib/stripe/create-stripe-checkout";
import { pathsConfig } from "@/config/paths";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect, RedirectType } from "next/navigation";
import { siteConfig } from "@/config/site";

export async function createCheckout(params: z.infer<typeof CheckoutSchema>) {
  const user = await getCurrentSession();

  if (!user) redirect("/sign-in");

  const plan = getPlanDetails(params.planId);

  const customerId = await billingApi.getCustomerId(params.teamId);
  const customerEmail = user?.email!;

  const variantQuantities = await getQuantity(params.teamId, plan.lineItems);

  const returnUrl = new URL(pathsConfig.app.teamBilling, siteConfig.url)
    .toString()
    .replace("[team]", params.slug);

  const session = await createStripeCheckout({
    teamId: params.teamId,
    customerId,
    customerEmail,
    plan,
    variantQuantities,
    returnUrl,
    metadata: {},
    embedded: false,
  });

  if (!session) {
    return;
  }

  if (!session.url) {
    return;
  }

  redirect(session.url);
}

async function getQuantity(teamId: string, lineItem: LineItemSchema[]) {
  const variantQuantities: Array<{
    quantity: number;
    variantId: string;
  }> = [];

  lineItem.forEach(async (item) => {
    if (item.type === "per_seat") {
      const quantity = await teamApi.getMembersCount(teamId);

      variantQuantities.push({
        quantity,
        variantId: item.id,
      });
    }
  });

  return variantQuantities;
}

function getPlanDetails(planId: string) {
  const plan = billingConfig.plans.find((plan) => plan.id === planId);

  if (!plan) throw new Error("Plan not found");

  return plan;
}
