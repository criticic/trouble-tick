import { HitsChart } from '@/components/hits-chart';
import { Navbar } from '@/components/navbar';
import { NewTrackerDialog } from '@/components/new-tracker-dialog';
import TrackerLinkActions from '@/components/tracker-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { events, projects, trackers } from '@/lib/db/schema';
import { format, startOfHour, subHours } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { desc, eq, inArray } from 'drizzle-orm';
import { groupBy } from 'lodash';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session?.user) return redirect('/');

    const id = (await params).id;
    const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .then((res) => res[0]);

    const trackersList = await db
        .select()
        .from(trackers)
        .where(eq(trackers.projectId, id));

    const eventsData = await db
        .select()
        .from(events)
        .where(
            inArray(
                events.trackerId,
                trackersList.map((t) => t.id),
            ),
        )
        .orderBy(desc(events.timestamp))
        .limit(100);

    const groupedTrackers = groupBy(trackersList, 'type');

    // Process events data for the chart
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
        const hour = subHours(new Date(), i);
        return {
            hour: format(hour, 'ha'),
            count: eventsData.filter(
                (event) =>
                    startOfHour(
                        fromZonedTime(event.timestamp, 'UTC'),
                    ).getTime() === startOfHour(hour).getTime(),
            ).length,
        };
    }).reverse();

    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />

            <div className='flex-1 space-y-6 p-8'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                        <Button variant='outline' size='sm' asChild>
                            <Link
                                href='/dashboard'
                                className='flex items-center gap-2'
                            >
                                <ChevronLeft className='h-4 w-4' />
                                Back to Projects
                            </Link>
                        </Button>
                        <h1 className='text-2xl font-bold'>{project?.name}</h1>
                    </div>
                    <NewTrackerDialog projectId={id} />
                </div>

                <div className='grid gap-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Spy Pixels</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                {(groupedTrackers['pixel'] || []).map(
                                    (tracker) => (
                                        <Card key={tracker.id}>
                                            <CardContent className='pt-6'>
                                                <TrackerLinkActions
                                                    tracker={tracker}
                                                    baseUrl={
                                                        process.env
                                                            .NEXT_PUBLIC_APP_URL!
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>URL Shorteners</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                {(groupedTrackers['url'] || []).map(
                                    (tracker) => (
                                        <Card key={tracker.id}>
                                            <CardContent className='pt-6'>
                                                <TrackerLinkActions
                                                    tracker={tracker}
                                                    baseUrl={
                                                        process.env
                                                            .NEXT_PUBLIC_APP_URL!
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {eventsData.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Referrers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Object.entries(
                                groupBy(eventsData, 'referrer'),
                            ).map(([ref, items]) => (
                                <div key={ref} className='flex justify-between'>
                                    <span>{ref || 'Direct'}</span>
                                    <span>{items.length}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <HitsChart data={last24Hours} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>User Agent</TableHead>
                                    <TableHead>Tracker</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {eventsData.map(async (event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>
                                            {format(
                                                fromZonedTime(
                                                    event.timestamp,
                                                    'IST'
                                                ),
                                                'MMM dd, yyyy h:mm a',
                                            )}
                                        </TableCell>
                                        <TableCell>{event.ip}</TableCell>
                                        <TableCell>
                                            {event.city + ', ' + event.country}
                                        </TableCell>
                                        <TableCell className='max-w-[300px] truncate'>
                                            {event.userAgent}
                                        </TableCell>
                                        <TableCell>
                                            {
                                                trackersList.find(
                                                    (t) =>
                                                        t.id ===
                                                        event.trackerId,
                                                )?.slug
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
