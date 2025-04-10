"use client";

import { CheckCircle2 } from "lucide-react";

import { If } from "@/components/premadekit/if";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import {
  BillingConfig,
  getPrimaryLineItem,
  LineItemSchema,
} from "../schema/create-billing-schema";
import { CheckoutButton } from "./checkout-button";
import { LineItemDetails } from "./line-item-details";

interface BillingPlansProps {
  config: BillingConfig;
  teamId: string;
  alwaysDisplayMonthlyPrice?: boolean;
}

type Interval = "month" | "year";

export function BillingPlans({
  config,
  teamId,
  alwaysDisplayMonthlyPrice = true,
}: BillingPlansProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-y-6 lg:gap-y-0 lg:gap-x-4">
      {config.plans.map((plan) => {
        const lineItem = getPrimaryLineItem(config, plan.id);
        const lineItemsToDisplay = plan.lineItems.filter((item) => {
          return item.type !== "flat";
        });

        if (!plan.custom && !lineItem) {
          throw new Error(`Primary line item not found for plan ${plan.id}`);
        }

        return (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col justify-between rounded-xl border p-6 w-full lg:w-4/12",
              {
                "border-primary": plan.highlighted,
                "border-border": !plan.highlighted,
              }
            )}
          >
            <If condition={plan.badge}>
              <div
                className={
                  "absolute -top-2.5 left-0 flex w-full justify-center"
                }
              >
                <Badge
                  className={plan.highlighted ? "" : "bg-background"}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <span>{plan.badge}</span>
                </Badge>
              </div>
            </If>

            <div className={"flex flex-col space-y-6"}>
              <div className={"flex flex-col space-y-2.5"}>
                <div className={"flex items-center space-x-6"}>
                  <b
                    className={
                      "text-current-foreground font-heading font-semibold uppercase tracking-tight"
                    }
                  >
                    {plan.name}
                  </b>
                </div>

                <span className={cn(`text-muted-foreground h-6 text-sm`)}>
                  {plan.description}
                </span>
              </div>

              <Separator />

              <div className={"flex flex-col space-y-2"}>
                <div
                  className={`animate-in slide-in-from-left-4 fade-in flex items-end gap-2 duration-500`}
                >
                  <span
                    className={
                      "font-heading flex items-center text-3xl font-semibold tracking-tighter"
                    }
                  >
                    <LineItemPrice
                      plan={plan}
                      interval={"month"}
                      lineItem={lineItem}
                      alwaysDisplayMonthlyPrice={alwaysDisplayMonthlyPrice}
                    />
                  </span>

                  <If condition={!plan.custom}>
                    <span
                      className={"text-muted-foreground text-sm leading-loose"}
                    >
                      <If condition={plan.interval} fallback={"Lifetime"}>
                        {plan.interval == "month" ? "/month" : "/year"}
                      </If>
                    </span>
                  </If>
                </div>

                <If condition={plan.name}>
                  <span
                    className={cn(
                      `animate-in slide-in-from-left-4 fade-in text-muted-foreground flex items-center space-x-0.5 text-sm capitalize`
                    )}
                  >
                    <span>
                      <If condition={plan.interval} fallback={"Lifetime"}>
                        {(interval) => (
                          <>
                            Billed {interval === "month" ? "Monthly" : "Yearly"}
                          </>
                        )}
                      </If>
                    </span>

                    <If condition={lineItem && lineItem?.type !== "flat"}>
                      <span>/</span>

                      <span
                        className={cn(
                          `animate-in slide-in-from-left-4 fade-in text-sm capitalize`
                        )}
                      >
                        <If condition={lineItem?.type === "per_seat"}>
                          Per Team Member
                        </If>

                        <If condition={lineItem?.unit}>
                          Per {lineItem?.unit} usage
                        </If>
                      </span>
                    </If>
                  </span>
                </If>
              </div>

              <CheckoutButton plan={plan} teamId={teamId} />

              <Separator />

              <div className={"flex flex-col"}>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-x-3">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm text-secondary-foreground">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <If condition={true && lineItemsToDisplay.length}>
                <Separator />

                <div className={"flex flex-col space-y-2"}>
                  <h6 className={"text-sm font-semibold"}>Details</h6>

                  <LineItemDetails
                    selectedInterval={plan.interval}
                    currency={plan.currency}
                    lineItems={lineItemsToDisplay}
                  />
                </div>
              </If>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LineItemPrice({
  lineItem,
  plan,
  interval,
  alwaysDisplayMonthlyPrice = true,
}: {
  lineItem: LineItemSchema | undefined;
  plan: {
    label?: string;
    currency: string;
  };
  interval: Interval | undefined;
  alwaysDisplayMonthlyPrice?: boolean;
}) {
  const isYearlyPricing = interval === "year";

  const cost = lineItem
    ? isYearlyPricing
      ? alwaysDisplayMonthlyPrice
        ? Number(lineItem.price).toFixed(2)
        : lineItem.price
      : lineItem?.price
    : 0;

  const costString =
    lineItem &&
    formatCurrency({
      currencyCode: plan.currency,
      locale: "en-US",
      value: cost,
    });

  const labelString = plan.label && plan.label;

  return costString ?? labelString ?? <>Custom Plan</>;
}
