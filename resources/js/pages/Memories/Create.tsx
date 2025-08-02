import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircleIcon, ImageIcon, InfoIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create New Album',
        href: '/memories/create',
    },
];

interface PageProps {
    currentYear: number;
    currentMonth: string;
    existingMemories: Record<string, Array<{ memory_month: string; memory_year: number }>>;
    [key: string]: unknown;
}

export default function Index() {
    const { currentYear, currentMonth, existingMemories } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm<{
        memory_title: string;
        memory_description: string;
        memory_month: string;
        memory_year: number;
        images: File[];
    }>({
        memory_title: '',
        memory_description: '',
        memory_month: '',
        memory_year: currentYear || new Date().getFullYear(),
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isMonthTaken, setIsMonthTaken] = useState(false);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Generate year options (current year and past 10 years)
    const currentYearValue = currentYear || new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYearValue - i);

    // Check if selected month/year combination is taken
    useEffect(() => {
        if (data.memory_month && data.memory_year && existingMemories) {
            const yearMemories = existingMemories[data.memory_year.toString()] || [];
            const taken = yearMemories.some((memory) => memory.memory_month === data.memory_month);
            setIsMonthTaken(taken);
        } else {
            setIsMonthTaken(false);
        }
    }, [data.memory_month, data.memory_year, existingMemories]);

    // Helper function to format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

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

        // Clean up the preview URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);

        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.images.length < 5) {
            alert('Please select at least 5 images to create an album');
            return;
        }

        if (isMonthTaken) {
            alert('You already have an album for this month and year. Please choose a different month/year or delete the existing album first.');
            return;
        }

        post(route('memories.store'), {
            forceFormData: true,
        });
    };

    // Helper function to check if a month is available for the selected year
    const isMonthAvailable = (month: string) => {
        if (!existingMemories) return true;
        const yearMemories = existingMemories[data.memory_year.toString()] || [];
        return !yearMemories.some((memory) => memory.memory_month === month);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create your new album" />

            <div className="mx-auto max-w-4xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Memory Album</h1>
                    <p className="text-gray-600">Upload 5-10 images to create your monthly memory album (max 10MB each)</p>
                    <div className="mt-2 rounded-lg bg-blue-50 p-3">
                        <p className="text-sm text-blue-700">
                            <InfoIcon className="mr-1 inline h-4 w-4" />
                            You can only create one album per month per year. This helps you curate your best memories!
                        </p>
                    </div>
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
                        {errors.memory_title && <p className="mt-1 text-sm text-red-600">{errors.memory_title}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="memoryYear" className="mb-2 block text-sm font-medium text-gray-700">
                                Year
                            </label>
                            <select
                                id="memoryYear"
                                required
                                value={data.memory_year}
                                onChange={(e) => setData('memory_year', parseInt(e.target.value))}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {errors.memory_year && <p className="mt-1 text-sm text-red-600">{errors.memory_year}</p>}
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
                                {months.map((month) => (
                                    <option
                                        key={month}
                                        value={month}
                                        disabled={!isMonthAvailable(month)}
                                        className={!isMonthAvailable(month) ? 'text-gray-400' : ''}
                                    >
                                        {month} {!isMonthAvailable(month) ? '(Already exists)' : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.memory_month && <p className="mt-1 text-sm text-red-600">{errors.memory_month}</p>}
                        </div>
                    </div>

                    {isMonthTaken && (
                        <Alert variant="destructive">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Month Already Taken</AlertTitle>
                            <AlertDescription>
                                You already have an album for {data.memory_month} {data.memory_year}. Please choose a different month/year combination
                                or delete the existing album first to replace it.
                            </AlertDescription>
                        </Alert>
                    )}

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
                            placeholder="Describe your memory album - what made this month special?"
                        />
                        {errors.memory_description && <p className="mt-1 text-sm text-red-600">{errors.memory_description}</p>}
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
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                                <p className="text-xs text-gray-500">Select 5-10 images at once</p>
                            </div>
                        </div>
                        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                    </div>

                    {/* Image Previews with File Sizes */}
                    {imagePreviews.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-sm font-medium text-gray-700">
                                Selected Images ({imagePreviews.length})
                                {imagePreviews.length < 5 && <span className="ml-2 text-red-500">Need at least 5 images</span>}
                                {imagePreviews.length >= 5 && <span className="ml-2 text-green-600">✓ Ready to create album</span>}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img src={preview} alt={`Preview ${index + 1}`} className="h-32 w-full rounded-md object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        {/* File Size Display */}
                                        <div className="bg-opacity-70 absolute right-0 bottom-0 left-0 rounded-b-md bg-black p-1 text-xs text-white">
                                            <div className="truncate">{data.images[index]?.name}</div>
                                            <div className="text-gray-300">{formatFileSize(data.images[index]?.size || 0)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={processing || data.images.length < 5 || isMonthTaken || !data.memory_month || !data.memory_year}
                        className="w-full"
                    >
                        {processing
                            ? 'Creating Album...'
                            : data.memory_month && data.memory_year
                              ? `Create Album for ${data.memory_month} ${data.memory_year} (${data.images.length} images)`
                              : `Create Album (${data.images.length} images)`}
                    </Button>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircleIcon className="h-4 w-4" />
                            <AlertTitle>Unable to create album</AlertTitle>
                            <AlertDescription>
                                <ul className="list-inside list-disc space-y-1 text-sm">
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key} className="text-red-600">
                                            <strong>{key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:</strong> {value}
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
