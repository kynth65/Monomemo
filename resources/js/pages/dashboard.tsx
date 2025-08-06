import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { SmoothScroll } from '@/components/smooth-scroll';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Image {
    id: number;
    image_url: string;
    image_public_id: string;
    order: number;
}

interface PageProps {
    images: Image[];
    [key: string]: unknown;
}

export default function Dashboard() {
    const { images } = usePage<PageProps>().props;
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [showFullScreen, setShowFullScreen] = useState(false);

    const openFullScreen = (image: Image) => {
        setSelectedImage(image);
        setShowFullScreen(true);
    };

    const closeFullScreen = () => {
        setSelectedImage(null);
        setShowFullScreen(false);
    };

    return (
        <SmoothScroll>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />

                <div className="p-6">
                    {images.length > 0 ? (
                        <div className="grid w-full grid-cols-2 gap-14 lg:grid-cols-3">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="group relative flex aspect-square items-center justify-center cursor-pointer"
                                    onClick={() => openFullScreen(image)}
                                >
                                    <img
                                        src={image.image_url}
                                        alt={`Memory Image ${image.id}`}
                                        className="h-fit w-fit border-2 border-gray-200 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No memories yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating your first memory album.</p>
                            <Link
                                href={route('memories.create')}
                                className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Create Album
                            </Link>
                        </div>
                    )}
                </div>
            </AppLayout>

            {/* Full Screen Image Modal */}
            {showFullScreen && selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={closeFullScreen}
                >
                    <div className="relative max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage.image_url}
                            alt="Full screen image"
                            className="max-h-full max-w-full object-contain"
                        />
                        <Button
                            onClick={closeFullScreen}
                            className="absolute top-4 right-4 h-10 w-10 rounded-full p-0"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
        </SmoothScroll>
    );
}