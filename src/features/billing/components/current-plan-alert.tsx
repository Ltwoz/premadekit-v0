import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { subscriptionStatusEnum } from "@/lib/db/schema/billing";

export function CurrentPlanAlert(
  props: React.PropsWithoutRef<{
    status: (typeof subscriptionStatusEnum.enumValues)[number];
  }>
) {
  let variant: "success" | "warning" | "destructive";

  let text: string;
  let title: string;

  switch (props.status) {
    case "active":
      title = "Active Plan";
      text = "Your subscription is active and in good standing.";
      break;
    case "trialing":
      title = "Trial Period";
      text = "You are currently in a trial period.";
      break;
    case "past_due":
      title = "Payment Past Due";
      text =
        "Your subscription payment is past due. Please update your payment method.";
      break;
    case "canceled":
      title = "Subscription Canceled";
      text = "Your subscription has been canceled.";
      break;
    case "unpaid":
      title = "Unpaid Subscription";
      text = "Your subscription is unpaid. Please resolve the payment issue.";
      break;
    case "incomplete":
      title = "Incomplete Subscription";
      text =
        "Your subscription setup is incomplete. Please complete the process.";
      break;
    case "incomplete_expired":
      title = "Incomplete Subscription Expired";
      text = "Your incomplete subscription has expired.";
      break;
    case "paused":
      title = "Subscription Paused";
      text = "Your subscription is currently paused.";
      break;
  }

  switch (props.status) {
    case "active":
      variant = "success";
      break;
    case "trialing":
      variant = "success";
      break;
    case "past_due":
      variant = "destructive";
      break;
    case "canceled":
      variant = "destructive";
      break;
    case "unpaid":
      variant = "destructive";
      break;
    case "incomplete":
      variant = "warning";
      break;
    case "incomplete_expired":
      variant = "destructive";
      break;
    case "paused":
      variant = "warning";
      break;
  }

  return (
    <Alert variant={variant}>
      <AlertTitle>{title}</AlertTitle>

      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
}
