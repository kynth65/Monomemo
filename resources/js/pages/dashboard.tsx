import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-6">
                {/* Main Grid Container */}
                <div className="grid w-full grid-cols-1 gap-0 border border-gray-300 lg:grid-cols-3">
                    {/* First Row - 3 equal columns */}
                    <div className="aspect-square border-r border-b border-gray-300 bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>
                    <div className="aspect-square border-r border-b border-gray-300 bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>
                    <div className="aspect-square border-b border-gray-300 bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>

                    {/* Second Row - 3 equal columns */}
                    <div className="aspect-square border-r border-b border-gray-300 bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>
                    <div className="aspect-square border-r border-b border-gray-300 bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>
                    <div className="aspect-square border-b border-gray-300 bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>

                    {/* Third Row - 3 equal columns */}
                    <div className="aspect-square border-r border-gray-300 bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>
                    <div className="aspect-square border-r border-gray-300 bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>
                    <div className="aspect-square bg-white p-10">
                        <div className="h-full w-full rounded bg-gray-200"></div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
