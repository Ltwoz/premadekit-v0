"use client";

import { CheckCircle2 } from "lucide-react";

import { If } from "@/components/premadekit/if";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BillingConfig } from "../schema/create-billing-schema";
import { CheckoutButton } from "./checkout-button";

interface BillingPlansProps {
  config: BillingConfig;
  teamId: string;
}

export function BillingPlans(props: BillingPlansProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-y-6 lg:gap-y-0 lg:gap-x-4">
      {props.config.plans.map((plan) => (
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
              className={"absolute -top-2.5 left-0 flex w-full justify-center"}
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
              {/* <Price
                    isMonthlyPrice={props.alwaysDisplayMonthlyPrice}
                    interval={interval}
                  >
                    <LineItemPrice
                      plan={props.plan}
                      product={props.product}
                      interval={interval}
                      lineItem={lineItem}
                      alwaysDisplayMonthlyPrice={
                        props.alwaysDisplayMonthlyPrice
                      }
                    />
                  </Price> */}
              <div
                className={`animate-in slide-in-from-left-4 fade-in flex items-end gap-2 duration-500`}
              >
                <span
                  className={
                    "font-heading flex items-center text-3xl font-semibold tracking-tighter"
                  }
                >
                  {/* <LineItemPrice
                        plan={props.plan}
                        product={props.product}
                        interval={interval}
                        lineItem={lineItem}
                        alwaysDisplayMonthlyPrice={
                          props.alwaysDisplayMonthlyPrice
                        }
                      /> */}
                </span>

                <span className={"text-muted-foreground text-sm leading-loose"}>
                  <If condition={plan.interval} fallback={"Lifetime"}>
                    {plan.interval == "month" ? "/month" : "/year"}
                  </If>
                </span>
              </div>

              <If condition={plan.name}>
                <span
                  className={cn(
                    `animate-in slide-in-from-left-4 fade-in text-muted-foreground flex items-center space-x-0.5 text-sm capitalize`
                  )}
                >
                  <span>
                    <If condition={plan.interval} fallback={"Lifetime"}>
                      {(interval) => interval}
                    </If>
                  </span>

                  {/* <If condition={lineItem && lineItem?.type !== "flat"}>
                        <span>/</span>

                        <span
                          className={cn(
                            `animate-in slide-in-from-left-4 fade-in text-sm capitalize`
                          )}
                        >
                          <If condition={lineItem?.type === "per_seat"}>
                            <Trans i18nKey={"billing:perTeamMember"} />
                          </If>

                          <If condition={lineItem?.unit}>
                            <Trans
                              i18nKey={"billing:perUnit"}
                              values={{
                                unit: lineItem?.unit,
                              }}
                            />
                          </If>
                        </span>
                      </If> */}
                </span>
              </If>
            </div>

            <CheckoutButton plan={plan} teamId={props.teamId} />

            {/* <If
                  condition={plan.id && props.CheckoutButton}
                  fallback={
                    <DefaultCheckoutButton
                      paths={props.paths}
                      product={props.product}
                      highlighted={highlighted}
                      plan={props.plan}
                      redirectToCheckout={props.redirectToCheckout}
                    />
                  }
                >
                  {(CheckoutButton) => (
                    <CheckoutButton
                      highlighted={highlighted}
                      planId={props.plan.id}
                      productId={props.product.id}
                    />
                  )}
                </If> */}

            <Separator />

            <div className={"flex flex-col"}>
              <ul className="space-y-2">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-x-3">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm text-secondary-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* <If
              condition={props.displayPlanDetails && lineItemsToDisplay.length}
            >
              <Separator />

              <div className={"flex flex-col space-y-2"}>
                <h6 className={"text-sm font-semibold"}>
                  <Trans i18nKey={"billing:detailsLabel"} />
                </h6>

                <LineItemDetails
                  selectedInterval={props.plan.interval}
                  currency={props.product.currency}
                  lineItems={lineItemsToDisplay}
                />
              </div>
            </If> */}
          </div>
        </div>
      ))}
    </div>
  );
}
