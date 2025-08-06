import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircleIcon, ImageIcon, InfoIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Image compression utility functions
const compressImage = (
    file: File,
    options: {
        maxSizeMB?: number;
        maxWidthOrHeight?: number;
        quality?: number;
        minQuality?: number;
    } = {},
): Promise<File> => {
    const { maxSizeMB = 5, maxWidthOrHeight = 1920, quality = 0.8, minQuality = 0.3 } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = async () => {
            try {
                let { width, height } = img;

                if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
                    if (width > height) {
                        height = (height * maxWidthOrHeight) / width;
                        width = maxWidthOrHeight;
                    } else {
                        width = (width * maxWidthOrHeight) / height;
                        height = maxWidthOrHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                let currentQuality = quality;
                let compressedFile: Blob | null;

                do {
                    compressedFile = await new Promise<Blob | null>((resolveBlob) => {
                        canvas.toBlob(resolveBlob, 'image/jpeg', currentQuality);
                    });

                    if (!compressedFile) {
                        throw new Error('Failed to compress image');
                    }

                    if (compressedFile.size <= maxSizeMB * 1024 * 1024 || currentQuality <= minQuality) {
                        break;
                    }

                    currentQuality -= 0.1;
                } while (currentQuality >= minQuality);

                const finalFile = new File([compressedFile!], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });

                resolve(finalFile);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
};

const compressImages = async (files: File[], options = {}) => {
    const compressedFiles: File[] = [];
    const errors: { file: string; error: string }[] = [];

    for (let i = 0; i < files.length; i++) {
        try {
            const compressedFile = await compressImage(files[i], options);
            compressedFiles.push(compressedFile);
        } catch (error) {
            console.error(`Failed to compress ${files[i].name}:`, error);
            errors.push({
                file: files[i].name,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    return { compressedFiles, errors };
};

const needsCompression = (file: File, maxSizeMB = 5): boolean => {
    return file.size > maxSizeMB * 1024 * 1024;
};

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

interface CompressionStat {
    name: string;
    originalSize: number;
    compressedSize: number;
    savings: string;
}

export default function Index() {
    const { currentYear, existingMemories } = usePage<PageProps>().props;

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
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionStats, setCompressionStats] = useState<CompressionStat[]>([]);

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

    // Updated handleImageChange with compression
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }

        if (files.length === 0) return;

        setIsCompressing(true);

        try {
            // Check which files need compression
            const filesToCompress = files.filter((file) => needsCompression(file, 5)); // 5MB threshold
            const smallFiles = files.filter((file) => !needsCompression(file, 5));

            console.log(`${filesToCompress.length} files need compression, ${smallFiles.length} are already small enough`);

            let finalFiles = [...smallFiles]; // Start with files that don't need compression
            const stats: CompressionStat[] = [];

            // Compress large files
            if (filesToCompress.length > 0) {
                const { compressedFiles, errors } = await compressImages(filesToCompress, {
                    maxSizeMB: 5, // Target 5MB max (well under Cloudinary's 50MB limit)
                    maxWidthOrHeight: 1920,
                    quality: 0.8,
                    minQuality: 0.3,
                });

                if (errors.length > 0) {
                    console.warn('Some files failed to compress:', errors);
                    // You could show a warning to the user here
                }

                finalFiles = [...finalFiles, ...compressedFiles];

                // Create compression stats for display
                filesToCompress.forEach((originalFile, index) => {
                    if (compressedFiles[index]) {
                        stats.push({
                            name: originalFile.name,
                            originalSize: originalFile.size,
                            compressedSize: compressedFiles[index].size,
                            savings: (((originalFile.size - compressedFiles[index].size) / originalFile.size) * 100).toFixed(1),
                        });
                    }
                });
            }

            setCompressionStats(stats);
            setData('images', finalFiles);

            // Create preview URLs for all final files
            const previews = finalFiles.map((file) => URL.createObjectURL(file));
            setImagePreviews(previews);
        } catch (error) {
            console.error('Error processing images:', error);
            alert('Error processing images. Please try again.');
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        // Clean up the preview URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);

        setData('images', newImages);
        setImagePreviews(newPreviews);

        // Update compression stats if removing a compressed image
        const removedImage = data.images[index];
        setCompressionStats((prev) => prev.filter((stat) => stat.name !== removedImage.name));
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
                    <p className="text-gray-600">Upload 5-10 images to create your monthly memory album (auto-optimized)</p>
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

                    {/* Multiple Image Upload with Compression */}
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
                                        <span>{isCompressing ? 'Compressing images...' : 'Upload images'}</span>
                                        <input
                                            id="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="sr-only"
                                            disabled={isCompressing}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF - any size (auto-optimized)</p>
                                <p className="text-xs text-gray-500">Select 5-10 images at once</p>
                                {isCompressing && (
                                    <div className="mt-2">
                                        <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                                            <svg
                                                className="mr-2 -ml-1 h-3 w-3 animate-spin text-blue-800"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Processing images...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}

                        {/* Compression Stats */}
                        {compressionStats.length > 0 && (
                            <div className="mt-3 rounded-md bg-green-50 p-3">
                                <h4 className="mb-2 text-sm font-medium text-green-800">Images Optimized Successfully ✓</h4>
                                <div className="space-y-1 text-xs text-green-700">
                                    {compressionStats.map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="mr-2 max-w-[200px] truncate">{stat.name}</span>
                                            <span className="whitespace-nowrap">
                                                {formatFileSize(stat.originalSize)} → {formatFileSize(stat.compressedSize)}
                                                <span className="ml-1 font-medium text-green-600">({stat.savings}% saved)</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                        disabled={processing || isCompressing || data.images.length < 5 || isMonthTaken || !data.memory_month || !data.memory_year}
                        className="w-full"
                    >
                        {processing
                            ? 'Creating Album...'
                            : isCompressing
                              ? 'Processing Images...'
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
