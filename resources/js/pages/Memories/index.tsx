import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Memories',
        href: '/memories',
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Memories" />
            <div className="flex h-full w-full items-center justify-center">
                <h1 className="text-lg text-green-400">Memories</h1>
            </div>
        </AppLayout>
    );
}
