import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';

const turso = createClient({
    url:
        process.env.NODE_ENV === 'production'
            ? process.env.TURSO_CONNECTION_URL!
            : 'http://127.0.0.1:8080',
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso);
