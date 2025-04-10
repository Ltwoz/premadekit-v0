import { BadgeCheck } from "lucide-react";
import { formatDate } from "date-fns";

import { If } from "@/components/premadekit/if";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Subscription, SubscriptionItem } from "@/lib/db/schema/billing";
import billingConfig from "@/config/billing";
import { BillingPortalButton } from "./billing-portal-button";
import { CurrentPlanBadge } from "./current-plan-badge";
import { getPlanByVariantId } from "../schema/create-billing-schema";
import { CurrentPlanAlert } from "./current-plan-alert";

interface CurrentPlanProps {
  subscription: Subscription & {
    subscriptionItems: SubscriptionItem[];
  };
  slug: string;
  teamId: string;
}

export function CurrentPlan({ subscription, slug, teamId }: CurrentPlanProps) {
  const lineItems = subscription.subscriptionItems;
  const firstLineItem = lineItems[0];

  if (!firstLineItem) {
    throw new Error("No line items found in subscription");
  }

  const { plan } = getPlanByVariantId(billingConfig, firstLineItem.variantId);

  if (!plan) {
    throw new Error(
      "Plan not found. Did you forget to add it to the billing config?"
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Plan</CardTitle>

        <CardDescription>
          Below are the details of your current plan. You can change your plan
          or cancel your subscription at any time.
        </CardDescription>
      </CardHeader>

      <CardContent className={"space-y-4 border-t pt-4 text-sm"}>
        <div className={"flex flex-col space-y-1"}>
          <div className={"flex items-center space-x-2 text-lg font-semibold"}>
            <BadgeCheck
              className={
                "s-6 fill-green-500 text-white dark:fill-white dark:text-black"
              }
            />

            <span data-test={"current-plan-card-product-name"}>
              {plan.name}
            </span>

            <CurrentPlanBadge status={subscription.status} />
          </div>

          <div>
            <p className={"text-muted-foreground"}>{plan.description}</p>
          </div>
        </div>

        {/*
          Only show the alert if the subscription requires action
          (e.g. trial ending soon, subscription canceled, etc.)
        */}
        <If condition={!subscription.active}>
          <div data-test={"current-plan-card-status-alert"}>
            <CurrentPlanAlert status={subscription.status} />
          </div>
        </If>

        <If condition={subscription.cancelAtPeriodEnd}>
          <Alert variant={"warning"}>
            <AlertTitle>Subscription Cancelled</AlertTitle>

            <AlertDescription>
              Your subscription will be cancelled at the end of the period
              <span className={"ml-1"}>
                {formatDate(subscription.currentPeriodEnd ?? "", "P")}
              </span>
            </AlertDescription>
          </Alert>
        </If>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
        <p className="text-sm font-medium text-muted-foreground">
          {subscription.cancelAtPeriodEnd
            ? "Your plan will be canceled on "
            : "Your plan renews on "}
          {formatDate(subscription.currentPeriodEnd, "P")}.
        </p>

        <BillingPortalButton slug={slug} teamId={teamId} />
      </CardFooter>
    </Card>
  );
}
