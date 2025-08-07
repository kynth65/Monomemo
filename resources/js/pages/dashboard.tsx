import { SmoothScroll } from '@/components/smooth-scroll';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

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
                        <div className="columns-2 gap-4 sm:gap-6 lg:columns-3 lg:gap-8">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="group mb-4 cursor-pointer break-inside-avoid overflow-hidden transition-all duration-200 hover:shadow-lg sm:mb-6 lg:mb-8"
                                    onClick={() => openFullScreen(image)}
                                >
                                    <img
                                        src={image.image_url}
                                        alt={`Memory Image ${image.id}`}
                                        className="w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                                        loading="lazy"
                                        style={{
                                            imageRendering: 'auto',
                                            display: 'block',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4" onClick={closeFullScreen}>
                    <div className="relative flex h-full max-h-full w-full max-w-full items-center justify-center sm:max-w-4xl">
                        <img
                            src={selectedImage.image_url}
                            alt="Full screen image"
                            className="max-h-[90vh] max-w-[95vw] object-contain sm:h-full sm:w-full"
                            onClick={(e) => e.stopPropagation()} // Prevent clicks on image from closing modal
                            style={{
                                imageRendering: 'auto',
                                width: 'auto',
                                height: 'auto',
                            }}
                        />
                    </div>
                </div>
            )}
        </SmoothScroll>
    );
}
