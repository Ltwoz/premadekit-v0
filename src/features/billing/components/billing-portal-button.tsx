"use client";

import { Button } from "@/components/ui/button";
import { createBillingPortalSession } from "../server/create-billing-portal-session";

interface BillingPortalProps {
  slug: string;
  teamId: string;
}

export function BillingPortalButton({ slug, teamId }: BillingPortalProps) {
  return (
    <Button
      onClick={() => {
        createBillingPortalSession({ teamId, slug });
      }}
    >
      Open Billing Portal
    </Button>
  );
}
