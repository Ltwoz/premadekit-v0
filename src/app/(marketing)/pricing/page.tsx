import { getCurrentSession } from "@/lib/auth/session";
import { getUserSubscriptionPlan } from "@/lib/stripe/subscription";
import { constructMetadata } from "@/lib/utils";
// import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingPlans } from "@/components/pricing-plans";

export const metadata = constructMetadata({
  title: "Pricing – SaaS Starter",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {
  const user = await getCurrentSession();
  console.log("user:", user);

  let subscriptionPlan;
  // if (user && user.id) {
  //   subscriptionPlan = await getUserSubscriptionPlan(user.id);
  // }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingPlans />
      <hr className="container" />
      {/* <ComparePlans /> */}
    </div>
  );
}
