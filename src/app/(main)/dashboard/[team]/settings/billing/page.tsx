import { If } from "@/components/premadekit/if";
import { CurrentPlan } from "@/features/billing/components/current-plan";
import { TeamCheckoutForm } from "@/features/billing/components/team-checkout-form";
import { loadTeamBilling } from "@/features/billing/server/team-billing-loader";
import { loadTeamWorkspace } from "@/features/team/server/team-workspace-loader";

interface TeamBillingPageProps {
  params: Promise<{ team: string }>;
}

export default async function TeamBillingPage(props: TeamBillingPageProps) {
  const { team } = await props.params;
  const workspace = await loadTeamWorkspace(team);
  const { subscription, customerId } = await loadTeamBilling(workspace.team.id);

  const Checkout = () => {
    return (
      <TeamCheckoutForm teamId={workspace.team.id} customerId={customerId} />
    );
  };

  return (
    <If condition={subscription} fallback={<Checkout />}>
      {(data) => {
        if (data.active) {
          return (
            <CurrentPlan
              subscription={data}
              slug={team}
              teamId={workspace.team.id}
            />
          );
        }
      }}
    </If>
  );
}
