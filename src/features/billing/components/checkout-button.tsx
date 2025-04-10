import { Button } from "@/components/ui/button";
import { PlanSchema } from "../schema/create-billing-schema";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { redirect, RedirectType, useParams } from "next/navigation";
import { createCheckout } from "../server/create-checkout";
import { If } from "@/components/premadekit/if";

interface CheckoutButtonProps {
  plan: PlanSchema;
  teamId: string;
}

export function CheckoutButton({ plan, teamId }: CheckoutButtonProps) {
  const params = useParams();
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (plan.custom) {
      if (!plan.href) return;

      return redirect(plan.href, RedirectType.push);
    }

    startTransition(async () => {
      const slug = params.team as string;

      await createCheckout({
        slug,
        teamId,
        planId: plan.id,
      });
    });
  }

  return (
    <Button
      variant={plan.highlighted ? "default" : "outline"}
      onClick={onClick}
    >
      {pending ? (
        <LoaderCircle className="mr-2 size-4 animate-spin" />
      ) : (
        <If condition={plan.custom} fallback={<span>Upgrade</span>}>
          <span>{plan.buttonLabel}</span>
        </If>
      )}
    </Button>
  );
}
