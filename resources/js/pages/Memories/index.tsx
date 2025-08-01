import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Volume2, X } from 'lucide-react';
import { useState } from 'react';

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
    [key: string]: unknown;
}

export default function MemoriesIndex() {
    const { flash, memories } = usePage<PageProps>().props;
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');

    const openMemoryGrid = (memory: Memory) => {
        setSelectedMemory(memory);
        setViewMode('grid');
        setSelectedImageIndex(0);
    };

    const openSingleImage = (index: number) => {
        setSelectedImageIndex(index);
        setViewMode('single');
    };

    const closeModal = () => {
        setSelectedMemory(null);
        setViewMode('grid');
        setSelectedImageIndex(0);
    };

    const navigateImage = (direction: 'next' | 'prev') => {
        if (!selectedMemory) return;
        const newIndex =
            direction === 'next'
                ? (selectedImageIndex + 1) % selectedMemory.images.length
                : (selectedImageIndex - 1 + selectedMemory.images.length) % selectedMemory.images.length;
        setSelectedImageIndex(newIndex);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Memory Albums" />

            <div className="space-y-6 p-4">
                {flash.message && (
                    <Alert className="max-w-xl">
                        <Volume2 className="h-4 w-4" />
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
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {memories.map((memory) => (
                            <div
                                key={memory.id}
                                className="group relative h-100 cursor-pointer bg-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                onClick={() => openMemoryGrid(memory)}
                            >
                                {/* Check if memory has images */}
                                {memory.images && memory.images.length > 0 ? (
                                    <>
                                        {/* Main Preview Image - Centered */}
                                        <div>
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={memory.images[0].image_url}
                                                    alt={memory.memory_title}
                                                    className="h-100 w-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Month - Top Center */}
                                        <div className="absolute top-2 right-0 -translate-x-1/2 transform">
                                            <div className="text-center">
                                                <h2 className="text-3xl font-bold tracking-wider text-white drop-shadow-2xl">
                                                    {memory.memory_month.toUpperCase()}
                                                </h2>

                                                <div className="mx-auto mt-1 h-1 w-12 rounded-full opacity-90" />
                                            </div>
                                        </div>

                                        {/* Content - Bottom */}
                                        <div className="absolute bottom-5 left-5">
                                            <h3 className="mb-1 text-lg font-bold text-white">{memory.memory_title}</h3>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* No Images State */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

                                        {/* Month - Center */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <h2 className="text-3xl font-bold tracking-wider text-gray-600">
                                                    {memory.memory_month.toUpperCase()}
                                                </h2>
                                                <div className="mx-auto mt-1 h-1 w-12 rounded-full bg-gray-600 opacity-60" />
                                            </div>
                                        </div>

                                        {/* Content - Bottom */}
                                        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-gray-800 via-gray-800/90 to-transparent p-4 pt-10">
                                            <h3 className="mb-1 text-lg font-bold text-white">{memory.memory_title}</h3>
                                            <p className="mb-2 line-clamp-2 text-sm text-gray-200">{memory.memory_description}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-300">
                                                <span>{new Date(memory.created_at).toLocaleDateString()}</span>
                                                <span>No photos</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Hover Effect Overlay */}
                                <div className="bg-opacity-0 group-hover:bg-opacity-10 absolute inset-0 transition-all duration-300" />
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

            {/* Modal for Image Grid/Single View */}
            {selectedMemory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 p-4">
                    <div className="relative max-h-full w-full max-w-6xl overflow-hidden rounded-xl bg-white">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between bg-white p-4 shadow-sm">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedMemory.memory_title}</h2>
                                <p className="text-sm text-gray-600">{selectedMemory.memory_description}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={closeModal} className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Modal Content */}
                        <div className="max-h-[80vh] overflow-auto">
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 gap-10 p-4 sm:grid-cols-3 md:grid-cols-4">
                                    {selectedMemory.images.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="group relative aspect-square cursor-pointer rounded-lg"
                                            onClick={() => openSingleImage(index)}
                                        >
                                            <img
                                                src={image.image_url}
                                                alt={`${selectedMemory.memory_title} - Image ${index + 1}`}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-104"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative flex items-center justify-center">
                                    {/* Navigation Buttons */}
                                    {selectedMemory.images.length > 1 && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigateImage('prev')}
                                                className="bg-opacity-80 hover:bg-opacity-100 absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white text-black"
                                            >
                                                <ArrowLeft className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigateImage('next')}
                                                className="bg-opacity-80 hover:bg-opacity-100 absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white text-black"
                                            >
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </>
                                    )}

                                    {/* Current Image */}
                                    <img
                                        src={selectedMemory.images[selectedImageIndex]?.image_url}
                                        alt={`${selectedMemory.memory_title} - Image ${selectedImageIndex + 1}`}
                                        className="max-h-[70vh] max-w-full object-contain"
                                    />

                                    {/* Image Counter */}
                                    <div className="bg-opacity-50 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-sm text-white">
                                        {selectedImageIndex + 1} / {selectedMemory.images.length}
                                    </div>

                                    {/* Back to Grid Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="bg-opacity-80 hover:bg-opacity-100 absolute top-4 left-4 rounded-full bg-white text-black"
                                    >
                                        <ArrowLeft className="mr-1 h-4 w-4" />
                                        Grid
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
