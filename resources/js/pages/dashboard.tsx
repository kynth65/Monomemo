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
                    <div className="flex aspect-square items-center justify-center border-r border-b border-gray-300 bg-white p-10">
                        <div className="h-60 w-90 rounded bg-gray-400"></div>
                    </div>
                    <div className="flex aspect-square items-center justify-center border-r border-b border-gray-300 bg-white p-10">
                        <div className="h-90 w-90 rounded bg-gray-400"></div>
                    </div>
                    <div className="flex aspect-square items-center justify-center border-b border-gray-300 bg-white p-10">
                        <div className="h-100 w-80 rounded bg-gray-400"></div>
                    </div>

                    {/* Second Row - 3 equal columns */}
                    <div className="flex aspect-square items-center justify-center border-r border-b border-gray-300 bg-white p-10">
                        <div className="h-100 w-80 rounded bg-gray-400"></div>
                    </div>
                    <div className="flex aspect-square items-center justify-center border-r border-b border-gray-300 bg-white p-10">
                        <div className="h-60 w-90 rounded bg-gray-400"></div>
                    </div>
                    <div className="flex aspect-square items-center justify-center border-b border-gray-300 bg-white p-10">
                        <div className="h-90 w-90 rounded bg-gray-400"></div>
                    </div>

                    {/* Third Row - 3 equal columns */}
                    <div className="flex aspect-square items-center justify-center border-r border-gray-300 bg-white p-10">
                        <div className="h-80 w-80 rounded bg-gray-400"></div>
                    </div>
                    <div className="flex aspect-square items-center justify-center border-r border-gray-300 bg-white p-10">
                        <div className="h-90 w-100 rounded bg-gray-400"></div>
                    </div>
                    <div className="flex aspect-square items-center justify-center bg-white p-10">
                        <div className="h-50 w-100 rounded bg-gray-400"></div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
