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
                    <div>
                        <label htmlFor="memoryDescription" className="m-4 block text-sm font-medium text-gray-700">
                            Memory Description
                        </label>
                        <textarea
                            id="memoryDescription"
                            name="memoryDescription"
                            rows={4}
                            className="m-4 mt-1 block max-w-2xl rounded-md border-gray-300 p-5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Describe your memory here"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="memoryMonth">Month of memory</label>
                        <select
                            id="memoryMonth"
                            name="memoryMonth"
                            className="m-4 mt-1 block max-w-2xl rounded-md border-gray-300 p-5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Select a month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
