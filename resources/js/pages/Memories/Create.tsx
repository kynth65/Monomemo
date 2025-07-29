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
                        <label htmlFor="memoryTitle" className="m-4 block text-sm font-medium text-gray-700">
                            Memory Title
                        </label>
                        <input
                            type="text"
                            id="memoryTitle"
                            name="memoryTitle"
                            className="m-4 mt-1 block h-14 w-50 rounded-md border-gray-300 p-5 shadow-sm focus:w-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter your memory title"
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
