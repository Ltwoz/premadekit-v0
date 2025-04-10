"use server";

import { redirect } from "next/navigation";
import * as billingApi from "@/features/billing/server/api";
import { createStripeBillingPortalSession } from "@/lib/stripe/create-stripe-billing-portal-session";
import { z } from "zod";
import { BillingPortalSchema } from "../schema/billing-portal-schema";
import { pathsConfig } from "@/config/paths";
import { siteConfig } from "@/config/site";

export async function createBillingPortalSession(
  params: z.infer<typeof BillingPortalSchema>
) {
  const customerId = await billingApi.getCustomerId(params.teamId);

  if (!customerId) {
    throw new Error("Customer not found");
  }

  const returnUrl = getBillingPortalReturnUrl(params.slug);

  const { url } = await createStripeBillingPortalSession({
    customerId,
    returnUrl,
  });

  return redirect(url);
}

function getAccountUrl(path: string, slug: string) {
  return new URL(path, siteConfig.url).toString().replace("[team]", slug);
}

function getBillingPortalReturnUrl(slug: string) {
  return getAccountUrl(pathsConfig.app.teamBilling, slug);
}
