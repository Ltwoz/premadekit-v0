import { z } from "zod";

export enum LineItemType {
  Flat = "flat",
  PerSeat = "per_seat",
  Metered = "metered",
}

const BillingIntervalSchema = z.enum(["month"]);
const LineItemTypeSchema = z.enum(["flat", "per_seat", "metered"]);

export const PaymentTypeSchema = z.enum(["one-time", "recurring"]);

export const LineItemSchema = z
  .object({
    id: z
      .string({
        description:
          "Unique identifier for the line item. Defined by the Provider.",
      })
      .min(1),
    name: z
      .string({
        description: "Name of the line item. Displayed to the user.",
      })
      .min(1),
    description: z
      .string({
        description:
          "Description of the line item. Displayed to the user and will replace the auto-generated description inferred from the line item. This is useful if you want to provide a more detailed description to the user.",
      })
      .optional(),
    price: z
      .number({
        description: "Price of the line item. Displayed to the user.",
      })
      .min(0),
    type: LineItemTypeSchema,
    unit: z
      .string({
        description:
          'Unit of the line item. Displayed to the user. Example "seat" or "GB"',
      })
      .optional(),
    tiers: z
      .array(
        z.object({
          cost: z.number().min(0),
          upTo: z.union([z.number().min(0), z.literal("unlimited")]),
        })
      )
      .optional(),
  })
  .refine(
    (data) =>
      data.type !== LineItemType.Metered ||
      (data.unit && data.tiers !== undefined),
    {
      message: "Metered line items must have a unit and tiers",
      path: ["type", "unit", "tiers"],
    }
  )
  .refine(
    (data) => {
      if (data.type === LineItemType.Metered) {
        return data.price === 0;
      }

      return true;
    },
    {
      message:
        "Metered line items must have a price of 0. Please add a different line item type for a flat fee (Stripe)",
      path: ["type", "price"],
    }
  );

const PlanSchema = z
  .object({
    id: z
      .string({
        description:
          "Unique identifier for the plan. Defined by th Provider.",
      })
      .min(1),
    name: z
      .string({
        description: "Name of the plan. Displayed to the user.",
      })
      .min(1),
    description: z
      .string({
        description: "Description of the plan. Displayed to the user.",
      })
      .min(1),
    currency: z
      .string({
        description: "Currency code for the plan. Displayed to the user.",
      })
      .min(3)
      .max(3),
    badge: z
      .string({
        description:
          'Badge for the plan. Displayed to the user. Example: "Popular"',
      })
      .optional(),
    benefits: z
      .array(
        z.string({
          description: "Benefits of the plan. Displayed to the user.",
        })
      )
      .nonempty(),
    limitations: z
      .array(
        z.string({
          description: "Limitations of the plan. Displayed to the user.",
        })
      )
      .optional(),
    enableDiscountField: z
      .boolean({
        description: "Enable discount field for the plan in the checkout.",
      })
      .optional(),
    highlighted: z
      .boolean({
        description: "Highlight this plan. Displayed to the user.",
      })
      .optional(),
    interval: BillingIntervalSchema.optional(),
    custom: z.boolean().default(false).optional(),
    href: z.string().min(1).optional(),
    lineItems: z.array(LineItemSchema).refine(
      (schema) => {
        const types = schema.map((item) => item.type);

        const perSeat = types.filter(
          (type) => type === LineItemType.PerSeat
        ).length;

        const flat = types.filter((type) => type === LineItemType.Flat).length;

        return perSeat <= 1 && flat <= 1;
      },
      {
        message: "Plans can only have one per-seat and one flat line item",
        path: ["lineItems"],
      }
    ),
    paymentType: PaymentTypeSchema,
  })
  .refine(
    (data) => {
      if (data.custom) {
        return data.lineItems.length === 0;
      }

      return data.lineItems.length > 0;
    },
    {
      message: "Non-Custom Plans must have at least one line item",
      path: ["lineItems"],
    }
  )
  .refine(
    (data) => {
      if (data.custom) {
        return data.lineItems.length === 0;
      }

      return data.lineItems.length > 0;
    },
    {
      message: "Custom Plans must have 0 line items",
      path: ["lineItems"],
    }
  )
  .refine(
    (data) => data.paymentType !== "one-time" || data.interval === undefined,
    {
      message: "One-time plans must not have an interval",
      path: ["paymentType", "interval"],
    }
  )
  .refine(
    (data) => data.paymentType !== "recurring" || data.interval !== undefined,
    {
      message: "Recurring plans must have an interval",
      path: ["paymentType", "interval"],
    }
  )
  .refine(
    (item) => {
      const lineItems = item.lineItems.filter(
        (item) => item.type !== LineItemType.Metered
      );

      const ids = lineItems.map((item) => item.id);

      return ids.length === new Set(ids).size;
    },
    {
      message: "Line item IDs must be unique",
      path: ["lineItems"],
    }
  )
  .refine(
    (data) => {
      if (data.paymentType === "one-time") {
        const nonFlatLineItems = data.lineItems.filter(
          (item) => item.type !== LineItemType.Flat
        );

        return nonFlatLineItems.length === 0;
      }

      return true;
    },
    {
      message: "One-time plans must not have non-flat line items",
      path: ["paymentType", "lineItems"],
    }
  );

const BillingSchema = z
  .object({
    plans: z.array(PlanSchema),
  })
  .refine(
    (data) => {
      const ids = data.plans.flatMap((plan) =>
        plan.lineItems.map((item) => item.id)
      );

      return ids.length === new Set(ids).size;
    },
    {
      message: "Line item IDs must be unique",
      path: ["plans"],
    }
  );

export function createBillingSchema(schema: z.infer<typeof BillingSchema>) {
  return BillingSchema.parse(schema);
}

export type BillingConfig = z.infer<typeof BillingSchema>;
export type PlanSchema = z.infer<typeof PlanSchema>;
export type LineItemSchema = z.infer<typeof LineItemSchema>;

export function getLineItemTypeById(
  config: BillingConfig,
  id: string
) {
  const lineItem = config.plans
    .flatMap((plan) => plan.lineItems)
    .find((item) => item.id === id);

  if (!lineItem) {
    throw new Error(`Line item with id ${id} not found`);
  }

  return lineItem.type;
}