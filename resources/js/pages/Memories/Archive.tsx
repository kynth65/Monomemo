import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive as ArchiveIcon, ArrowLeft, ArrowRight, RotateCcw, Trash2, Volume2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Memory Albums',
        href: '/memories',
    },
    {
        title: 'Archive',
        href: '/archive',
    },
];

interface Image {
    id: number;
    image_url: string;
    image_public_id: string;
    order: number;
}

interface ArchivedMemory {
    id: number;
    memory_title: string;
    memory_description: string;
    memory_month: string;
    memory_year: number;
    archived_at: string;
    created_at: string;
    images: Image[];
}

interface PageProps {
    flash: { message?: string; error?: string };
    archivedMemories: ArchivedMemory[];
    [key: string]: unknown;
}

export default function Archive() {
    const { flash, archivedMemories } = usePage<PageProps>().props;
    const [selectedMemory, setSelectedMemory] = useState<ArchivedMemory | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

    // Get available years from archived memories
    const availableYears = useMemo(() => {
        const years = [...new Set(archivedMemories.map((memory) => memory.memory_year))];
        return years.sort((a, b) => b - a);
    }, [archivedMemories]);

    // Month order for proper sorting
    const filteredAndSortedMemories = useMemo(() => {
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let filtered = archivedMemories;

        if (selectedYear !== 'all') {
            filtered = archivedMemories.filter((memory) => memory.memory_year === selectedYear);
        }

        return filtered.sort((a, b) => {
            if (selectedYear === 'all' && a.memory_year !== b.memory_year) {
                return b.memory_year - a.memory_year;
            }

            const monthA = monthOrder.indexOf(a.memory_month);
            const monthB = monthOrder.indexOf(b.memory_month);
            return monthA - monthB;
        });
    }, [archivedMemories, selectedYear]);

    const openMemoryGrid = (memory: ArchivedMemory) => {
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

    const handleRestore = (memoryId: number) => {
        router.post(
            route('archive.restore', memoryId),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handlePermanentDelete = (memoryId: number) => {
        router.delete(route('archive.destroy', memoryId), {
            preserveScroll: true,
        });
        setShowDeleteConfirm(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archive" />
            <div className="space-y-6 p-4">
                {flash.message && (
                    <Alert className="max-w-xl border-green-200 bg-green-50">
                        <Volume2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{flash.message}</AlertDescription>
                    </Alert>
                )}

                {flash.error && (
                    <Alert className="max-w-xl border-red-200 bg-red-50">
                        <Volume2 className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{flash.error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ArchiveIcon className="h-6 w-6" />
                        <Label className="font-bold sm:text-sm lg:text-2xl">Archived Albums</Label>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('memories.index')} className="flex items-center space-x-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Memories</span>
                        </Link>
                    </Button>
                </div>

                {/* Year Filter Buttons */}
                {availableYears.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <Label className="text-sm font-medium">Filter by year:</Label>
                        <Button
                            variant={selectedYear === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedYear('all')}
                            className="text-xs"
                        >
                            All Years
                        </Button>
                        {availableYears.map((year) => (
                            <Button
                                key={year}
                                variant={selectedYear === year ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedYear(year)}
                                className="text-xs"
                            >
                                {year}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Results Summary */}
                {selectedYear !== 'all' && filteredAndSortedMemories.length > 0 && (
                    <div className="text-sm text-gray-600">
                        Showing {filteredAndSortedMemories.length} archived album{filteredAndSortedMemories.length !== 1 ? 's' : ''} for{' '}
                        {selectedYear}
                    </div>
                )}

                {filteredAndSortedMemories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAndSortedMemories.map((memory) => (
                            <div
                                key={memory.id}
                                className="group relative rounded-lg border bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                            >
                                {/* Memory Preview */}
                                <div className="cursor-pointer" onClick={() => openMemoryGrid(memory)}>
                                    {memory.images && memory.images.length > 0 ? (
                                        <img
                                            src={memory.images[0].image_url}
                                            alt={memory.memory_title}
                                            className="h-48 w-full rounded-t-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-48 w-full items-center justify-center rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200">
                                            <div className="text-center">
                                                <h3 className="text-2xl font-bold text-gray-600">{memory.memory_month.toUpperCase()}</h3>
                                                <p className="mt-1 text-sm text-gray-500">{memory.memory_year}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Memory Info */}
                                <div className="p-4">
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="line-clamp-1 font-semibold text-gray-900">{memory.memory_title}</h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {memory.memory_month} {memory.memory_year}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mb-3 line-clamp-2 text-sm text-gray-700">{memory.memory_description}</p>

                                    <div className="mb-4 text-xs text-gray-500">Archived: {new Date(memory.archived_at).toLocaleDateString()}</div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRestore(memory.id)}
                                            className="flex flex-1 items-center justify-center space-x-1"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            <span>Restore</span>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setShowDeleteConfirm(memory.id)}
                                            className="flex items-center justify-center"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <ArchiveIcon className="h-full w-full" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {selectedYear === 'all' ? 'No archived albums' : `No archived albums for ${selectedYear}`}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {selectedYear === 'all'
                                ? 'Your archived albums will appear here when you archive them from your memories.'
                                : `You haven't archived any albums from ${selectedYear} yet.`}
                        </p>
                        <div className="mt-6">
                            <Button variant="outline" asChild>
                                <Link href={route('memories.index')}>Go to Memories</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">Permanently Delete Album?</h3>
                        <p className="mb-4 text-sm text-gray-600">
                            This action cannot be undone. This will permanently delete the album and all its images from our servers.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => handlePermanentDelete(showDeleteConfirm)}>
                                Delete Forever
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Image Grid/Single View */}
            {selectedMemory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm" onClick={closeModal}>
                    <div className="relative max-h-full w-full max-w-6xl overflow-hidden rounded-xl bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between bg-white p-4 shadow-sm">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedMemory.memory_title}</h2>
                                <p className="text-sm text-gray-600">{selectedMemory.memory_description}</p>
                                <p className="mt-1 text-xs text-gray-500">Archived: {new Date(selectedMemory.archived_at).toLocaleDateString()}</p>
                            </div>
                            <Button size="sm" onClick={closeModal} className="rounded-full">
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
