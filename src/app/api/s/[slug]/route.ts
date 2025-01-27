import { db } from '@/lib/db';
import { events, trackers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const headersList = await headers();
    const slug = (await params).slug;

    const tracker = await db
        .select()
        .from(trackers)
        .where(eq(trackers.slug, slug));

    if (!tracker) {
        return new Response('Not Found', { status: 404 });
    }

    const event = await db.insert(events).values({
        trackerId: tracker[0].id,
        ip: headersList.get('x-forwarded-for')!,
        userAgent: headersList.get('user-agent')!,
        referrer: headersList.get('referer')!,
    });

    console.log(event);

    return Response.redirect(tracker[0].targetUrl!, 302);
}
