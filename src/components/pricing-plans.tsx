/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
// import { pricingData } from "@/config/billing";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
// import { BillingFormButton } from "@/components/forms/billing-form-button";
import { HeaderSection } from "@/components/header-section";
import { CheckIcon, XIcon } from "lucide-react";

interface Paths {
  signUp: string;
  return: string;
}

interface PricingPlansProps {
  path?: Paths;
}

export function PricingPlans({ path }: PricingPlansProps) {
  const PricingCard = ({ offer }: { offer: any }) => {
    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
          // offer.title.toLocaleLowerCase() === "pro"
          //   ? "-m-0.5 border-2 border-purple-400"
          //   : ""
        )}
        key={offer.name}
      >
        <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
          <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {offer.name}
          </p>

          <div className="flex flex-row">
            <div className="flex items-end">
              <div className="flex text-left text-3xl font-semibold leading-6">
                ${offer.price}
              </div>
              <div className="-mb-1 ml-2 text-left text-sm font-medium text-muted-foreground">
                <div>/month</div>
              </div>
            </div>
          </div>
          {offer.price > 0 && (
            <div className="text-left text-sm text-muted-foreground">
              when charged monthly
            </div>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-16 p-6">
          <ul className="space-y-2 text-left text-sm font-medium leading-normal">
            {offer.benefits.map((feature: string) => (
              <li className="flex items-start gap-x-3" key={feature}>
                <CheckIcon className="size-5 shrink-0 text-purple-500" />
                <p>{feature}</p>
              </li>
            ))}

            {offer.limitations.length > 0 &&
              offer.limitations.map((feature: string) => (
                <li
                  className="flex items-start text-muted-foreground"
                  key={feature}
                >
                  <XIcon className="mr-3 size-5 shrink-0" />
                  <p>{feature}</p>
                </li>
              ))}
          </ul>

          {/* // <BillingFormButton
          //   year={false}
          //   offer={offer}
          //   subscriptionPlan={subscriptionPlan}
          // /> */}
          <Button
            // variant={
            //   offer.title.toLocaleLowerCase() === "pro"
            //     ? "default"
            //     : "outline"
            // }
            className="rounded-full"
            // onClick={() => setShowSignInModal(true)}
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <section className="flex flex-col items-center text-center">
        <HeaderSection label="Pricing" title="Start at full speed !" />

        <div className="grid gap-5 bg-inherit py-5 lg:grid-cols-3">
          {/* {pricingData.map((offer: any) => (
            <PricingCard offer={offer} key={offer.title} />
          ))} */}
        </div>

        <p className="mt-3 text-balance text-center text-base text-muted-foreground">
          Email{" "}
          <a
            className="font-medium text-primary hover:underline"
            href="mailto:support@saas-starter.com"
          >
            support@saas-starter.com
          </a>{" "}
          for to contact our support team.
          <br />
          <strong>
            You can test the subscriptions and won&apos;t be charged.
          </strong>
        </p>
      </section>
    </div>
  );
}
