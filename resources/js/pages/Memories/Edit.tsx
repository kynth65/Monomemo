import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Eye, Undo, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Memory Albums',
        href: '/memories',
    },
    {
        title: 'Edit Album',
        href: '#',
    },
];

interface Image {
    id: number;
    image_url: string;
    image_public_id: string;
}

interface Memory {
    id: number;
    memory_title: string;
    memory_description: string;
    memory_month: string;
    memory_year: number;
    images: Image[];
}

interface PageProps {
    memory: Memory;
    errors: Record<string, string>;
    [key: string]: unknown;
}

export default function Edit() {
    const { memory, errors } = usePage<PageProps>().props;

    const [existingImages, setExistingImages] = useState<Image[]>(memory.images);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, processing } = useForm({
        memory_title: memory.memory_title,
        memory_description: memory.memory_description,
        _method: 'PUT',
    });

    const remainingImages = existingImages.filter((img) => !imagesToDelete.includes(img.id)).length;
    const isValidImageCount = remainingImages >= 5 && remainingImages <= 10;

    const toggleDeleteExistingImage = (imageId: number) => {
        setImagesToDelete((prev) => {
            if (prev.includes(imageId)) {
                // Remove from deletion list (restore)
                return prev.filter((id) => id !== imageId);
            } else {
                // Add to deletion list
                return [...prev, imageId];
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidImageCount) {
            alert('Album must have between 5-10 images');
            return;
        }

        console.log('Submitting with data:', {
            memory_title: data.memory_title,
            memory_description: data.memory_description,
            deleted_image_ids: imagesToDelete,
        });

        // Use regular object instead of FormData for simpler handling
        const submitData: any = {
            memory_title: data.memory_title,
            memory_description: data.memory_description,
            _method: 'PUT',
        };

        // Only include deleted_image_ids if there are actually images to delete
        if (imagesToDelete.length > 0) {
            submitData.deleted_image_ids = JSON.stringify(imagesToDelete);
        }

        // Use Inertia's post method
        post(route('memories.update', memory.id), {
            data: submitData,
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Update successful:', page);
                setImagesToDelete([]);
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            },
            onFinish: () => {
                console.log('Request finished');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${memory.memory_title}`} />

            <div className="mx-auto max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Album</h1>
                        <p className="text-gray-600">
                            {memory.memory_month} {memory.memory_year}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('memories.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Albums
                        </Link>
                    </Button>
                </div>

                {/* Image Count Warning */}
                {!isValidImageCount && (
                    <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                            Albums must have between 5-10 images. Currently: {remainingImages} images
                            {imagesToDelete.length > 0 && ` (${imagesToDelete.length} marked for deletion)`}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Caption Editing */}
                    <div className="space-y-4 rounded-lg border bg-white p-6">
                        <h2 className="text-lg font-semibold">Album Details</h2>

                        <div>
                            <Label htmlFor="memory_title">Title</Label>
                            <Input
                                id="memory_title"
                                value={data.memory_title}
                                onChange={(e) => setData('memory_title', e.target.value)}
                                className={errors.memory_title ? 'border-red-500' : ''}
                                required
                            />
                            {errors.memory_title && <p className="mt-1 text-sm text-red-500">{errors.memory_title}</p>}
                        </div>

                        <div>
                            <Label htmlFor="memory_description">Description</Label>
                            <Textarea
                                id="memory_description"
                                value={data.memory_description}
                                onChange={(e) => setData('memory_description', e.target.value)}
                                rows={3}
                                className={errors.memory_description ? 'border-red-500' : ''}
                                required
                            />
                            {errors.memory_description && <p className="mt-1 text-sm text-red-500">{errors.memory_description}</p>}
                        </div>
                    </div>

                    {/* Existing Images - Remove Only */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Current Images ({existingImages.length} total)</h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Click the X to mark for deletion, or click the undo button to restore.
                            {imagesToDelete.length > 0 && (
                                <span className="ml-2 font-medium text-red-600">({imagesToDelete.length} marked for deletion)</span>
                            )}
                        </p>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {existingImages.map((image, index) => {
                                const isMarkedForDeletion = imagesToDelete.includes(image.id);

                                return (
                                    <div
                                        key={image.id}
                                        className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                                            isMarkedForDeletion ? 'border-red-300 opacity-50' : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <img src={image.image_url} alt={`Image ${index + 1}`} className="h-40 w-full object-cover" />

                                        {/* Status Badge */}
                                        <div
                                            className={`absolute top-2 left-2 rounded px-2 py-1 text-xs text-white ${
                                                isMarkedForDeletion ? 'bg-red-600' : 'bg-blue-600'
                                            }`}
                                        >
                                            {isMarkedForDeletion ? 'DELETE' : index + 1}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="absolute right-2 bottom-2 z-10 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            {/* Preview Button */}
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewImage(image.image_url);
                                                }}
                                                className="h-8 w-8 bg-black/50 p-0 text-white hover:bg-black/70"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {/* Delete/Restore Button */}
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    toggleDeleteExistingImage(image.id);
                                                }}
                                                className={`z-20 h-8 w-8 p-0 ${
                                                    isMarkedForDeletion ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                                } text-white`}
                                                title={isMarkedForDeletion ? 'Restore image' : 'Mark for deletion'}
                                            >
                                                {isMarkedForDeletion ? <Undo className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                            </Button>
                                        </div>

                                        {/* Deletion Overlay */}
                                        {isMarkedForDeletion && (
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-red-500/20">
                                                <div className="text-center">
                                                    <span className="block rounded bg-white px-2 py-1 text-sm font-semibold text-red-700">
                                                        Will be deleted
                                                    </span>
                                                    <span className="mt-1 block rounded bg-black/50 px-2 py-1 text-xs text-white">
                                                        Click undo to restore
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Error Display */}
                    {Object.keys(errors).length > 0 && (
                        <Alert className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                <div className="space-y-2">
                                    <p className="font-medium">Please fix the following errors:</p>
                                    <ul className="list-inside list-disc space-y-1">
                                        {Object.entries(errors).map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:</strong> {value}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('memories.index')}>Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !isValidImageCount || !data.memory_title || !data.memory_description}
                            className="min-w-[120px]"
                        >
                            {processing ? 'Saving...' : `Save Changes (${remainingImages} images)`}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-h-full max-w-4xl">
                        <img src={previewImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                        <Button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 h-10 w-10 rounded-full p-0">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
