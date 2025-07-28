import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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
            <div className="m-4">
                <Link href={route('memories.create')}>
                    <Button>Click me</Button>
                </Link>
            </div>
        </AppLayout>
    );
}
