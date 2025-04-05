import {
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  primaryKey,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";

export const permissionEnum = pgEnum("permission", [
  "roles.manage",
  "billing.manage",
  "settings.manage",
  "members.manage",
  "invites.manage",
]);

export const teams = pgTable("teams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email").unique(),
  pictureUrl: text("picture_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roles = pgTable("roles", {
  name: varchar("name", { length: 50 }).notNull().primaryKey(),
  hierarchyLevel: integer("hierarchy_level").notNull().unique(),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    role: varchar("role", { length: 50 })
      .notNull()
      .references(() => roles.name),
    permission: varchar("permission", { length: 50 }).notNull(),
  },
  (t) => [
    {
      unique: unique().on(t.role, t.permission),
    },
  ]
);

export const memberships = pgTable(
  "memberships",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: varchar("role", { length: 50 })
      .notNull()
      .references(() => roles.name),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    {
      compoundKey: primaryKey({
        columns: [t.teamId, t.userId],
      }),
    },
  ]
);

export const invitations = pgTable(
  "invitations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    invitedBy: text("invited_by")
      .notNull()
      .references(() => users.id),
    role: varchar("role", { length: 50 })
      .notNull()
      .references(() => roles.name),
    inviteToken: text("invite_token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at")
      .notNull()
      .$defaultFn(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      }),
  },
  (t) => [
    {
      unique: unique().on(t.teamId, t.email),
    },
  ]
);

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [memberships.teamId],
    references: [teams.id],
  }),
  role: one(roles, {
    fields: [memberships.role],
    references: [roles.name],
  }),
}));

export const teamRelations = relations(teams, ({ many }) => ({
  memberships: many(memberships),
}));

export const roleRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
  memberships: many(memberships),
}));

export const permissionRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.role],
    references: [roles.name],
  }),
}));
