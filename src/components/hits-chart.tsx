'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Event } from '@/lib/db/schema';
import { format, startOfHour, subHours } from 'date-fns';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

const chartConfig = {
    count: {
        label: 'Hits',
        color: '#3b82f6',
    },
} satisfies ChartConfig;

export function HitsChart({ data }: { data: Event[] }) {
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
        const hour = subHours(new Date(), i);
        return {
            hour: format(hour, 'ha'),
            count: data.filter(
                (event: Event) =>
                    startOfHour(
                        // Workaround for timezone offset in development
                        process.env.NODE_ENV === 'development'
                            ? event.timestamp.getTime() -
                                  event.timestamp.getTimezoneOffset() *
                                      60 *
                                      1000
                            : event.timestamp,
                    ).getTime() === startOfHour(hour).getTime(),
            ).length,
        };
    }).reverse();
    return (
        <Card className='md:col-span-3'>
            <CardHeader>
                <CardTitle>Hits over last 24 hours</CardTitle>
            </CardHeader>
            <CardContent className='h-[300px]'>
                <ChartContainer config={chartConfig} className='w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={last24Hours}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey='hour'
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey='count'
                                fill='var(--color-count)'
                                radius={4}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
