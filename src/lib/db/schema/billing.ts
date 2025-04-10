import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { teams } from "./team";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "trialing",
  "canceled",
  "paused",
  "past_due",
  "unpaid",
  "incomplete",
  "incomplete_expired",
]);

export const subscriptionItemTypeEnum = pgEnum("subscription_item_type", [
  "flat",
  "per_seat",
  "metered",
]);

export const billingCustomers = pgTable(
  "billing_customers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    customerId: varchar("customer_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.teamId, t.customerId)]
);

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  billingCustomerId: text("billing_customer_id")
    .notNull()
    .references(() => billingCustomers.id, { onDelete: "cascade" }),
  active: boolean("active").notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  currency: varchar("currency", { length: 3 }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptionItems = pgTable(
  "subscription_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    subscriptionId: text("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 255 }).notNull(),
    variantId: varchar("variant_id", { length: 255 }).notNull(),
    type: subscriptionItemTypeEnum("type").notNull(),
    quantity: integer("quantity").notNull().default(1),
    price: integer("price").notNull(),
    interval: varchar("interval", { length: 255 }).notNull(),
    intervalCount: integer("interval_count").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.subscriptionId, t.productId, t.variantId)]
);

export const billingCustomersRelations = relations(
  billingCustomers,
  ({ one }) => ({
    team: one(teams, {
      fields: [billingCustomers.teamId],
      references: [teams.id],
    }),
    subscriptions: one(subscriptions, {
      fields: [billingCustomers.id],
      references: [subscriptions.billingCustomerId],
    }),
  })
);

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    team: one(teams, {
      fields: [subscriptions.teamId],
      references: [teams.id],
    }),
    billingCustomer: one(billingCustomers, {
      fields: [subscriptions.billingCustomerId],
      references: [billingCustomers.id],
    }),
    subscriptionItems: many(subscriptionItems),
  })
);

export const subscriptionItemsRelations = relations(
  subscriptionItems,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionItems.subscriptionId],
      references: [subscriptions.id],
    }),
  })
);

export type Subscription = typeof subscriptions.$inferSelect;
export type SubscriptionItem = typeof subscriptionItems.$inferSelect;