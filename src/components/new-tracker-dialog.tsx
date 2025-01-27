'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function NewTrackerDialog({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'pixel' | 'url'>('pixel');
    const [slug, setSlug] = useState('');
    const [targetUrl, setTargetUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            fetch(`/api/projects/${projectId}/trackers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    slug,
                    targetUrl: type === 'url' ? targetUrl : '',
                }),
            });
            setOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating tracker:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size='sm'>
                    <Plus className='mr-2 h-4 w-4' />
                    New Tracker
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Tracker</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                        <Label>Type</Label>
                        <Select
                            value={type}
                            onValueChange={(v: 'pixel' | 'url') => setType(v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select tracker type' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='pixel'>Spy Pixel</SelectItem>
                                <SelectItem value='url'>
                                    URL Shortener
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='slug'>Slug</Label>
                        <Input
                            id='slug'
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder='unique-identifier'
                            required
                        />
                    </div>

                    {type === 'url' && (
                        <div className='space-y-2'>
                            <Label htmlFor='targetUrl'>Target URL</Label>
                            <Input
                                id='targetUrl'
                                type='url'
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                placeholder='https://example.com'
                                required
                            />
                        </div>
                    )}

                    <Button type='submit' disabled={loading}>
                        {loading ? 'Creating...' : 'Create Tracker'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
