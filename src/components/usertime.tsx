'use client';

import { format } from 'date-fns';

export default function CodeBlock({ timestamp }: { timestamp: Date }) {
    // This is a workaround to fix the timezone issue in development
    let actualTimestamp;
    if (process.env.NODE_ENV === 'development') {
        actualTimestamp =
            timestamp.getTime() - timestamp.getTimezoneOffset() * 60 * 1000;
    } else {
        actualTimestamp = timestamp;
    }

    return <>{format(actualTimestamp, 'MMM dd, yyyy h:mm a')}</>;
}
