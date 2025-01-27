import { Navbar } from '@/components/navbar';
import { NewProjectDialog } from '@/components/new-project-dialog';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const session = await auth();
    if (!session?.user) return redirect('/');

    const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, session.user.id!));

    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />

            <div className='flex-1 p-8'>
                <div className='mb-6 flex items-center justify-between'>
                    <h1 className='text-2xl font-bold'>Your Projects</h1>
                    <NewProjectDialog />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    {userProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/project/${project.id}`}
                            className='rounded-lg border p-4 transition-colors hover:bg-accent'
                        >
                            <h3 className='font-medium'>{project.name}</h3>
                            <p className='text-sm text-muted-foreground'>
                                Created{' '}
                                {format(
                                    fromZonedTime(project.createdAt, 'UTC'),
                                    'MMM dd, yyyy',
                                )}
                            </p>
                        </Link>
                    ))}

                    {userProjects.length === 0 && (
                        <div className='col-span-full py-12 text-center'>
                            <p className='mb-4 text-muted-foreground'>
                                No projects found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
