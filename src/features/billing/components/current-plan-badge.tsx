import { Badge } from "@/components/ui/badge";
import { subscriptionStatusEnum } from "@/lib/db/schema/billing";

type Status = (typeof subscriptionStatusEnum.enumValues)[number];

export function CurrentPlanBadge(
  props: React.PropsWithoutRef<{
    status: Status;
  }>
) {
  let variant: "success" | "warning" | "destructive";
  const text = (() => {
    switch (props.status) {
      case "active":
        return "Active";
      case "trialing":
        return "Trialing";
      case "past_due":
        return "Past Due";
      case "canceled":
        return "Canceled";
      case "unpaid":
        return "Unpaid";
      case "incomplete":
        return "Incomplete";
      case "incomplete_expired":
        return "Incomplete Expired";
      case "paused":
        return "Paused";
    }
  })();

  switch (props.status) {
    case "active":
      // case "succeeded":
      variant = "success";
      break;
    case "trialing":
      variant = "success";
      break;
    case "past_due":
      // case "failed":
      variant = "destructive";
      break;
    case "canceled":
      variant = "destructive";
      break;
    case "unpaid":
      variant = "destructive";
      break;
    case "incomplete":
      // case "pending":
      variant = "warning";
      break;
    case "incomplete_expired":
      variant = "destructive";
      break;
    case "paused":
      variant = "warning";
      break;
  }

  return <Badge variant={variant}>{text}</Badge>;
}
