import "server-only";

import { cache } from "react";
import * as api from "./api";

export const loadTeamBilling = cache(billingLoader);

async function billingLoader(teamId: string) {
  const subscription = await api.getSubscription(teamId);
  const customerId = await api.getCustomerId(teamId);

  return { subscription, customerId };
}
