import { sql } from 'drizzle-orm';
import {
    integer,
    primaryKey,
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core';
import type { AdapterAccountType } from 'next-auth/adapters';

export const projects = sqliteTable('projects', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' })
        .default(sql`(current_timestamp)`)
        .notNull(),
});

export const trackers = sqliteTable('trackers', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('projectId')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    type: text('type').$type<'pixel' | 'url'>().notNull(),
    slug: text('slug').notNull().unique(),
    targetUrl: text('targetUrl'),
    isActive: integer('isActive', { mode: 'boolean' }).default(true),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' })
        .default(sql`(current_timestamp)`)
        .notNull(),
});

export const events = sqliteTable('events', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    trackerId: text('trackerId')
        .notNull()
        .references(() => trackers.id, { onDelete: 'cascade' }),
    ip: text('ip').notNull(),
    country: text('country'),
    city: text('city'),
    latitude: text('latitude'),
    longitude: text('longitude'),
    userAgent: text('userAgent').notNull(),
    referrer: text('referrer').notNull(),
    timestamp: integer('timestamp', { mode: 'timestamp_ms' })
        .default(sql`(datetime('now'))`)
        .notNull(),
});

// NextAuth tables
export const users = sqliteTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    image: text('image'),
});

export const accounts = sqliteTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccountType>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    }),
);

export const sessions = sqliteTable('session', {
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
    'verificationToken',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    }),
);

export const authenticators = sqliteTable(
    'authenticator',
    {
        credentialID: text('credentialID').notNull().unique(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        providerAccountId: text('providerAccountId').notNull(),
        credentialPublicKey: text('credentialPublicKey').notNull(),
        counter: integer('counter').notNull(),
        credentialDeviceType: text('credentialDeviceType').notNull(),
        credentialBackedUp: integer('credentialBackedUp', {
            mode: 'boolean',
        }).notNull(),
        transports: text('transports'),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    }),
);
