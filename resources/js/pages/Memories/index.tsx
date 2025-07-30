import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { MegaphoneIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Memories',
        href: '/memories',
    },
];

interface Memory {
    id: number;
    memory_title: string;
    memory_description: string;
    memory_month: string;
}

interface Flash {
    message?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    memories: Memory[];
}

interface PageProps {
    flash: Flash;
    [key: string]: any;
    memories: Memory[];
}

export default function MemoriesIndex() {
    const { flash, memories } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Memories" />

            <div className="space-y-6 p-4">
                {flash.message && (
                    <Alert className="max-w-xl">
                        <MegaphoneIcon className="h-4 w-4" />
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                <div>
                    <Button asChild>
                        <Link href={route('memories.create')}>Create New Memory</Link>
                    </Button>
                </div>

                {/* Add your memories list/grid here */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
            </div>

            {memories.length > 0 && (
                <div className="space-y-6 p-4">
                    <h2 className="text-lg font-bold">Memories</h2>
                    <ul className="grid h-full w-full grid-cols-1 gap-4 space-y-4 sm:grid-cols-2 lg:grid-cols-3">
                        {memories.map((memory) => (
                            <li key={memory.id} className="rounded-md border bg-white p-4 shadow-sm">
                                <h3 className="text-lg font-semibold">{memory.memory_title}</h3>
                                <p className="text-sm text-gray-600">{memory.memory_description}</p>
                                <span className="text-xs text-gray-500">Month: {memory.memory_month}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </AppLayout>
    );
}
