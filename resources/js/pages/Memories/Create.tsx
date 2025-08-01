import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircleIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create New Memory',
        href: '/memories/create',
    },
];

export default function Index() {
    // Fix: Define the proper type for the form data
    const { data, setData, post, processing, errors } = useForm<{
        memory_title: string;
        memory_description: string;
        memory_month: string;
        image: File | null;
    }>({
        memory_title: '',
        memory_description: '',
        memory_month: '',
        image: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('memories.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create your new memory" />
            <div className="m-4">This is your new memory</div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="memoryTitle" className="m-4 block text-sm font-medium text-gray-700">
                            Memory Title
                        </label>
                        <input
                            type="text"
                            id="memoryTitle"
                            name="memoryTitle"
                            required
                            value={data.memory_title}
                            onChange={(e) => setData('memory_title', e.target.value)}
                            className="m-4 mt-1 block h-14 w-50 rounded-md border-gray-300 p-5 shadow-sm focus:w-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter your memory title"
                        />
                    </div>

                    {/* Fixed IMAGE INPUT */}
                    <div>
                        <label htmlFor="memoryImage" className="m-4 block text-sm font-medium text-gray-700">
                            Memory Image
                        </label>
                        <input
                            type="file"
                            id="memoryImage"
                            name="memoryImage"
                            accept="image/*"
                            required
                            onChange={(e) => setData('image', e.target.files?.[0] || null)}
                            className="m-4 mt-1 block max-w-2xl rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="memoryDescription" className="m-4 block text-sm font-medium text-gray-700">
                            Memory Description
                        </label>
                        <Textarea
                            id="memoryDescription"
                            name="memoryDescription"
                            required
                            rows={4}
                            value={data.memory_description}
                            onChange={(e) => setData('memory_description', e.target.value)}
                            className="m-4 mt-1 block max-w-2xl rounded-md border-gray-300 p-5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Describe your memory here"
                        />
                    </div>

                    <div>
                        <label htmlFor="memoryMonth" className="m-4 block text-sm font-medium text-gray-700">
                            Month of memory
                        </label>
                        <select
                            id="memoryMonth"
                            required
                            name="memoryMonth"
                            value={data.memory_month}
                            onChange={(e) => setData('memory_month', e.target.value)}
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

                    <Button type="submit" disabled={processing} className="m-4">
                        {processing ? 'Uploading...' : 'Submit'}
                    </Button>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="m-4 max-w-xl">
                            <AlertCircleIcon />
                            <AlertTitle>Unable to post your memory.</AlertTitle>
                            <AlertDescription>
                                <ul className="list-inside list-disc text-sm">
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key} className="text-red-600">
                                            {value}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}
