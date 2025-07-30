import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircleIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Memories',
        href: '/memories',
    },
];

interface Flash {
    message?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
}

interface PageProps {
    flash: Flash;
    [key: string]: any; // Index signature for Inertia.js compatibility
}

export default function MemoriesIndex() {
    const { flash } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Memories" />

            <div className="space-y-6 p-4">
                {flash.message && (
                    <Alert className="max-w-xl">
                        <AlertCircleIcon className="h-4 w-4" />
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
        </AppLayout>
    );
}
