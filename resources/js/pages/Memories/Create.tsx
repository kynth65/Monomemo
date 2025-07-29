import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create New Memory',
        href: '/memories/create',
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create your new memory" />
            <div className="m-4"> This is your new memory</div>
            <div>
                <form>
                    <div>
                        <label htmlFor="memoryTitle" className="block text-sm font-medium text-gray-700">
                            Memory Title
                        </label>
                        <input
                            type="text"
                            id="memoryTitle"
                            name="memoryTitle"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter your memory title"
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
