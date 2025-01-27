'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Image, Link } from 'lucide-react';
import React from 'react';

const TrackerLinkActions = ({
    tracker,
    baseUrl,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tracker: any;
    baseUrl: string;
}) => {
    const fullUrl = `${baseUrl}${
        tracker.type === 'pixel'
            ? `/api/pixel/${tracker.slug}.png`
            : `/api/s/${tracker.slug}`
    }`;

    const { toast } = useToast();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied to clipboard',
            description: text,
        });
    };

    const getHtmlCode = () => {
        return `<img src="${fullUrl}" alt="Image" width="1" height="1" style="display:block" title="Image" />`;
    };

    return (
        <div className='space-y-2'>
            <a
                href={fullUrl}
                className='break-all font-mono text-sm hover:underline'
                rel='noopener'
                aria-label={`Tracking link for ${tracker.slug}`}
            >
                {fullUrl}
                {tracker.type === 'url' && (
                    <p className='truncate text-sm text-muted-foreground'>
                        → {tracker.targetUrl}
                    </p>
                )}
            </a>

            <div className='flex gap-2'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => copyToClipboard(fullUrl)}
                    className='flex items-center gap-1'
                >
                    <Link className='h-4 w-4' />
                    Copy URL
                </Button>

                {tracker.type === 'pixel' && (
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => copyToClipboard(getHtmlCode())}
                        className='flex items-center gap-1'
                    >
                        {
                            // eslint-disable-next-line jsx-a11y/alt-text
                            <Image className='h-4 w-4' />
                        }
                        Copy HTML
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TrackerLinkActions;
