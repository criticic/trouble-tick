import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) return new Response('Unauthorized', { status: 401 });
    const { name } = await request.json();

    const newProject = await db
        .insert(projects)
        .values({
            name: name,
            userId: session.user.id!,
        })
        .returning();

    return Response.json(newProject);
}
