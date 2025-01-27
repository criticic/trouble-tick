import type { Config } from 'drizzle-kit';

import './envConfig.ts';

export default {
    schema: './src/lib/db/schema.ts',
    out: './src/lib/db/migrations',
    dialect: 'turso',
    dbCredentials: {
        url:
            process.env.NODE_ENV === 'production'
                ? process.env.TURSO_CONNECTION_URL!
                : 'http://127.0.0.1:8080',
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
} satisfies Config;
