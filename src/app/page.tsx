import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { signIn } from '@/lib/auth';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
    const session = await auth();

    if (session?.user) {
        redirect('/dashboard');
    }

    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />

            <main className='container flex-1 py-12'>
                <div className='mx-auto max-w-4xl text-center'>
                    <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
                        Track user engagement with
                        <span className='text-primary'> spy pixels</span> and
                        <span className='text-primary'> URL tracking</span>
                    </h1>

                    <p className='mt-6 text-lg text-muted-foreground'>
                        Get detailed analytics about your email opens and link
                        clicks in real-time
                    </p>

                    <div className='mt-10 flex justify-center gap-4'>
                        <form
                            action={async () => {
                                'use server';
                                await signIn('github');
                            }}
                        >
                            <Button size='lg' type='submit'>
                                <Github className='mr-2 h-4 w-4' />
                                Sign Up with GitHub
                            </Button>
                        </form>
                        <Button size='lg' variant='outline' asChild>
                            <Link href='#'>Documentation</Link>
                        </Button>
                    </div>
                </div>

                <div className='mt-16 grid gap-6 md:grid-cols-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Spy Pixel Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-muted-foreground'>
                                Track email opens with invisible pixels. Get
                                geolocation, device info, and timestamps for
                                every open.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>URL Shortener</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-muted-foreground'>
                                Create trackable short links. Monitor clicks,
                                referrers, and user engagement metrics.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
