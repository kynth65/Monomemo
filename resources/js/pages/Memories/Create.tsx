import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircleIcon, ImageIcon, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create New Album',
        href: '/memories/create',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm<{
        memory_title: string;
        memory_description: string;
        memory_month: string;
        images: File[];
    }>({
        memory_title: '',
        memory_description: '',
        memory_month: '',
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }

        setData('images', files);

        // Create preview URLs
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.images.length < 5) {
            alert('Please select at least 5 images to create an album');
            return;
        }

        post(route('memories.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create your new album" />

            <div className="mx-auto max-w-4xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Memory Album</h1>
                    <p className="text-gray-600">Upload 5-10 images to create your monthly memory album</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="memoryTitle" className="mb-2 block text-sm font-medium text-gray-700">
                            Album Title
                        </label>
                        <input
                            type="text"
                            id="memoryTitle"
                            required
                            value={data.memory_title}
                            onChange={(e) => setData('memory_title', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Enter your album title"
                        />
                    </div>

                    <div>
                        <label htmlFor="memoryMonth" className="mb-2 block text-sm font-medium text-gray-700">
                            Month of Memory
                        </label>
                        <select
                            id="memoryMonth"
                            required
                            value={data.memory_month}
                            onChange={(e) => setData('memory_month', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

                    <div>
                        <label htmlFor="memoryDescription" className="mb-2 block text-sm font-medium text-gray-700">
                            Album Description
                        </label>
                        <Textarea
                            id="memoryDescription"
                            required
                            rows={4}
                            value={data.memory_description}
                            onChange={(e) => setData('memory_description', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Describe your memory album"
                        />
                    </div>

                    {/* Multiple Image Upload */}
                    <div>
                        <label htmlFor="images" className="mb-2 block text-sm font-medium text-gray-700">
                            Album Images (5-10 images required)
                        </label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                            <div className="space-y-1 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="images"
                                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500"
                                    >
                                        <span>Upload images</span>
                                        <input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB each</p>
                                <p className="text-xs text-gray-500">Select 5-10 images at once</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-sm font-medium text-gray-700">
                                Selected Images ({imagePreviews.length})
                                {imagePreviews.length < 5 && <span className="ml-2 text-red-500">Need at least 5 images</span>}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img src={preview} alt={`Preview ${index + 1}`} className="h-32 w-full rounded-md object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button type="submit" disabled={processing || data.images.length < 5} className="w-full">
                        {processing ? 'Creating Album...' : `Create Album (${data.images.length} images)`}
                    </Button>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Unable to create album</AlertTitle>
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
