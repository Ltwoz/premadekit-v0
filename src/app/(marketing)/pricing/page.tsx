import { getCurrentSession } from "@/lib/auth/session";
import { constructMetadata } from "@/lib/utils";
import { PricingPlans } from "@/components/pricing-plans";

export const metadata = constructMetadata({
  title: "Pricing – SaaS Starter",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {
  const user = await getCurrentSession();

  let subscriptionPlan;

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingPlans />
      <hr className="container" />
      {/* <ComparePlans /> */}
    </div>
  );
}
