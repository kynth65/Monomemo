import { Head, Link } from '@inertiajs/react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect, useRef, useState } from 'react';

import { ScrollAnimation } from '@/components/scroll-animation';
import Nothing from '../../audio/NothingCover.mp3';
import Azure_hotel from '../../images/azure-hotel.jpg';
import Ek_Viking from '../../images/ek-viking.jpg';
import MCU_Concert from '../../images/mcu-concert.jpg';
import My_Graduation from '../../images/my-graduation.jpg';
import Our_Second_Anniversary from '../../images/our-second-anniversary.jpg';
import Pangasinan from '../../images/pangasinan.jpg';
import Tagaytay_Cafe from '../../images/tagaytay-cafe.jpg';
import Tagaytay from '../../images/tagaytay.jpg';

const memories = [
    {
        image: Azure_hotel,
        title: 'Staycation at Azure Hotel',
        date: 'July 1, 2024',
        memory: 'Ang saya pala mag-staycation sa Azure Hotel! Sana maulit tayo dito soon. Yung tayong dalawa lang, enjoying the view and each other’s company.',
    },
    {
        image: Ek_Viking,
        title: 'EK Viking Ride',
        date: 'January 13, 2024',
        memory: 'Sobrang nakakatakot pala talaga sumakay dito, halos di ko na kinaya yung ride na yun! Pero ang saya kasi kasama kita. You make every moment an adventure, even the scary ones.',
    },
    {
        image: MCU_Concert,
        title: 'MCU Concert Experience',
        date: 'May 26, 2024',
        memory: 'Hindi ko malilimutan yung concert na ito kasi di man ako sanay sa gantong mga events, pero dahil sa presence mo, naging memorable siya. Your support made it special.',
    },
    {
        image: My_Graduation,
        title: 'My Graduation Day',
        date: 'July 11, 2024',
        memory: 'Having you there on my graduation day meant the world to me. Your support is my greatest motivation. We did it!',
    },
    {
        image: Our_Second_Anniversary,
        title: 'Our Second Anniversary',
        date: 'December 21, 2024',
        memory: "Two years of love, laughter, and growth. Celebrating with you felt like a beautiful milestone. I'm grateful for every moment we share. Here's to many more years together!",
    },
    {
        image: Pangasinan,
        title: 'Beach Trip to Pangasinan',
        date: 'December 15, 2024',
        memory: '16 hours of travel pero di ko siya ganon naramdaman dahil kasama kita. Mas masaya at mas magaan talaga kapag ikaw kasama ko kapag may mga ganitong trips. Thank you for making every trip an adventure worth remembering.',
    },
    {
        image: Tagaytay_Cafe,
        title: 'Cozy Cafe in Tagaytay',
        date: 'June 2, 2024',
        memory: 'Sobrang ganda ng view dito sa Tagaytay, lalo na naenjoy natin halos lahat ng parte ng lugar. Thankyou sa pagdala sa akin dito. Your thoughtfulness always makes our outings special.',
    },
    {
        image: Tagaytay,
        title: 'A Day in Tagaytay',
        date: 'June 1, 2024',
        memory: "Thankyou for giving me a day to relax and enjoy the beautiful scenery of Tagaytay. Your company made it even more special. I love how we can just be ourselves and enjoy each other's presence.",
    },
];

export default function OurJourney() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio(Nothing);
        audioRef.current.loop = true;

        const playAudio = async () => {
            try {
                await audioRef.current?.play();
                setIsPlaying(true);
            } catch (error) {
                console.error('Autoplay was prevented:', error);
                setIsPlaying(false);
            }
        };

        playAudio();

        return () => {
            audioRef.current?.pause();
        };
    }, []);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <ReactLenis root>
            <Head title="Our Journey" />
            <div className="min-h-screen bg-[#f8f7f5] text-[#2c2c2c]">
                <header className="py-12 text-center">
                    <Link href={route('home')}>
                        <h1 className="text-4xl font-extralight tracking-widest text-[#2c2c2c]">MONOMEMO</h1>
                    </Link>
                    <p className="mt-4 text-lg text-[#666]">A collection of our moments, just for you, Bubba.</p>
                </header>

                <main>
                    {memories.map((item, index) => (
                        <ScrollAnimation key={index} className="flex min-h-screen flex-col items-center justify-center p-6 md:flex-row">
                            <div
                                className={`flex w-full max-w-7xl flex-col items-center gap-16 md:flex-row ${
                                    index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                                }`}
                            >
                                <div className="w-full md:w-1/2">
                                    <img src={item.image} alt={item.title} className="w-full rounded-lg shadow-2xl" />
                                </div>
                                <div className="w-full text-center md:w-1/2 md:text-left">
                                    <h2 className="text-4xl font-light text-[#d4af37]">{item.title}</h2>
                                    <p className="mb-6 text-sm text-[#999]">{item.date}</p>
                                    <p className="text-xl leading-relaxed text-[#666]">{item.memory}</p>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </main>

                <footer className="py-16 text-center">
                    <p className="text-xl text-[#666]">To many more memories with you, my love.</p>
                    <div className="mt-8">
                        <Link
                            href={route('register')}
                            className="inline-block rounded-none border-2 border-[#2c2c2c] bg-[#2c2c2c] px-12 py-4 text-base leading-normal font-medium tracking-wider text-white uppercase transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]"
                        >
                            Let's Build Our Story
                        </Link>
                    </div>
                </footer>

                <div className="fixed right-8 bottom-8 z-50">
                    <button
                        onClick={togglePlayPause}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2c2c2c] text-white shadow-lg transition-transform hover:scale-110"
                        aria-label={isPlaying ? 'Pause music' : 'Play music'}
                    >
                        {isPlaying ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </ReactLenis>
    );
}
