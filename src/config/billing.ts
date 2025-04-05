import { createBillingSchema } from "@/features/billing/schema/create-billing-schema";

export default createBillingSchema({
  plans: [
    {
      id: "free",
      name: "Free",
      description: "For small business",
      currency: "USD",
      benefits: [
        "Up to 500 monthly posts",
        "Advanced analytics and reporting",
        "Access to business templates",
        "Priority customer support",
        "Exclusive webinars and training.",
      ],
      paymentType: "recurring",
      interval: "month",
      lineItems: [
        {
          id: "price_1NNwYHI1i3VnbZTqI2UzaHIe1",
          name: "free",
          price: 0,
          type: "flat" as const,
        },
      ],
    },
    {
      id: "plus",
      name: "Plus",
      description: "For growing business",
      badge: `Popular`,
      highlighted: true,
      currency: "USD",
      benefits: [
        "Up to 500 monthly posts",
        "Advanced analytics and reporting",
        "Access to business templates",
        "Priority customer support",
        "Exclusive webinars and training.",
      ],
      paymentType: "recurring",
      interval: "month",
      lineItems: [
        {
          id: "price_1QkpfaDB0szM0f6IHVQs7nlH",
          name: "Plus",
          price: 30,
          type: "flat" as const,
        },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      description: "For large business",
      currency: "USD",
      benefits: [
        "Up to 500 monthly posts",
        "Advanced analytics and reporting",
        "Access to business templates",
        "Priority customer support",
        "Exclusive webinars and training.",
      ],
      paymentType: "recurring",
      interval: "month",
      lineItems: [
        {
          id: "price_1NNwYHI1i3VnbZTqI2UzaHIe3",
          name: "Pro",
          price: 40,
          type: "flat" as const,
        },
      ],
    },
  ],
});
