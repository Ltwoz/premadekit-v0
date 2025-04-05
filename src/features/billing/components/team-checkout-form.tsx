"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import billingConfig from "@/config/billing";
import { BillingPlans } from "./billing-plans";

interface TeamCheckoutFormProps {
  teamId: string;
  customerId: string | undefined | null;
}

export function TeamCheckoutForm(props: TeamCheckoutFormProps) {
  const params = useParams();
  const [pending, startTransition] = useTransition();
  const [checkoutToken, setCheckoutToken] = useState<string | undefined>(
    undefined
  );

  if (checkoutToken) {
    return <>embeded checkout</>;
  }

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <BillingPlans config={billingConfig} teamId={props.teamId} />
      </CardContent>
    </Card>
  );
}
