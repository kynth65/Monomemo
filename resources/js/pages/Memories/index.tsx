import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { MegaphoneIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Memory Albums',
        href: '/memories',
    },
];

interface Image {
    id: number;
    image_url: string;
    image_public_id: string;
    order: number;
}

interface Memory {
    id: number;
    memory_title: string;
    memory_description: string;
    memory_month: string;
    created_at: string;
    images: Image[];
}

interface PageProps {
    flash: { message?: string };
    memories: Memory[];
    [key: string]: unknown; // Additional props can be added as needed
}

export default function MemoriesIndex() {
    const { flash, memories } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Memory Albums" />

            <div className="space-y-6 p-4">
                {flash.message && (
                    <Alert className="max-w-xl">
                        <MegaphoneIcon className="h-4 w-4" />
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Your Memory Albums</h1>
                    <Button asChild>
                        <Link href={route('memories.create')}>Create New Album</Link>
                    </Button>
                </div>

                {memories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {memories.map((memory) => (
                            <div key={memory.id} className="overflow-hidden rounded-lg bg-white shadow-md">
                                {/* Album Header */}
                                <div className="border-b p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{memory.memory_title}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{memory.memory_description}</p>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {memory.memory_month}
                                        </span>
                                    </div>
                                </div>

                                {/* Image Grid */}
                                <div className="p-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        {memory.images.slice(0, 6).map((image, index) => (
                                            <div key={image.id} className="relative">
                                                <img
                                                    src={image.image_url}
                                                    alt={`${memory.memory_title} - Image ${index + 1}`}
                                                    className="h-24 w-full rounded object-cover"
                                                />
                                                {/* Show count overlay on last visible image if there are more */}
                                                {index === 5 && memory.images.length > 6 && (
                                                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded bg-black">
                                                        <span className="font-semibold text-white">+{memory.images.length - 6}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                        <span>{memory.images.length} images</span>
                                        <span>{new Date(memory.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No albums yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Create your first memory album with 5-10 images.</p>
                        <div className="mt-6">
                            <Button asChild>
                                <Link href={route('memories.create')}>Create First Album</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
