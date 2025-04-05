import { Button } from "@/components/ui/button";
import { PlanSchema } from "../schema/create-billing-schema";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { createCheckout } from "../server/create-checkout";

interface CheckoutButtonProps {
  plan: PlanSchema;
  teamId: string;
}

export function CheckoutButton({ plan, teamId }: CheckoutButtonProps) {
  const params = useParams();
  const [pending, startTransition] = useTransition();

  return (
    <Button variant={plan.highlighted ? "default" : "outline"} onClick={() => {
      startTransition(async () => {
        const slug = params.team as string;

        await createCheckout({
          slug,
          teamId,
          planId: plan.id,
        })
      })
    }}>
      {pending ? (
        <LoaderCircle className="mr-2 size-4 animate-spin" />
      ) : (
        <>Upgrade</>
      )}
    </Button>
  );
}
