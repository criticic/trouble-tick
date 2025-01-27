import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects, trackers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user) return new Response('Unauthorized', { status: 401 });
    const { type, slug, targetUrl } = await request.json();
    const id = (await params).id;

    const project = await db.select().from(projects).where(eq(projects.id, id));

    if (!project) {
        return new Response('Not Found', { status: 404 });
    }

    const newTracker = await db
        .insert(trackers)
        .values({
            type,
            slug,
            targetUrl,
            projectId: id,
        })
        .returning();

    return Response.json(newTracker);
}
