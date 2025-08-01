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

// Updated Memory interface to include image fields
interface Memory {
    id: number;
    memory_title: string;
    memory_description: string;
    memory_month: string;
    image_url: string | null; // Added
    image_public_id: string | null; // Added
    created_at: string; // Added for sorting
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

                {memories.length > 0 ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Your Memories</h2>

                        {/* Updated grid layout with images */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {memories.map((memory) => (
                                <div
                                    key={memory.id}
                                    className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    {/* Image Section */}
                                    {memory.image_url && (
                                        <div className="aspect-w-16 aspect-h-9">
                                            <img
                                                src={memory.image_url}
                                                alt={memory.memory_title}
                                                className="h-48 w-full object-cover"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Content Section */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{memory.memory_title}</h3>
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                {memory.memory_month}
                                            </span>
                                        </div>

                                        <p className="mb-3 line-clamp-3 text-sm text-gray-600">{memory.memory_description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">{new Date(memory.created_at).toLocaleDateString()}</span>

                                            {/* Optional: Add action buttons */}
                                            <div className="flex space-x-2">{/* You can add Edit/Delete buttons here later */}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No memories yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first memory.</p>
                        <div className="mt-6">
                            <Button asChild>
                                <Link href={route('memories.create')}>Create First Memory</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
