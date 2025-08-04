import { Head, Link } from '@inertiajs/react';
import { ReactLenis } from '@studio-freight/react-lenis';

const memories = [
    {
        image: 'https://via.placeholder.com/1200x800.png/2c2c2c/f8f7f5?text=Our+First+Date',
        title: 'Our First Date',
        date: 'January 1, 2023',
        memory: `I remember being so nervous, but the moment I saw you, everything felt right. We talked for hours, and I didn't want the night to end. That's when I knew you were someone special.`,
    },
    {
        image: 'https://via.placeholder.com/1200x800.png/d4af37/2c2c2c?text=Our+First+Trip',
        title: 'Our First Trip',
        date: 'March 15, 2023',
        memory: `Spontaneous and perfect. I'll never forget watching the sunset with you, feeling like we were the only two people in the world. That trip brought us so much closer.`,
    },
    {
        image: 'https://via.placeholder.com/1200x800.png/f8f7f5/2c2c2c?text=Just+Because',
        title: 'Just Because',
        date: 'June 22, 2023',
        memory: `This wasn't a special occasion, just a random Tuesday, but it's one of my favorite memories. We were just being us, laughing and enjoying the simple moments. I love our ordinary days together.`,
    },
];

export default function OurJourney() {
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
                        <section key={index} className="flex min-h-screen flex-col items-center justify-center p-6 md:flex-row">
                            <div
                                className={`flex w-full max-w-7xl flex-col items-center gap-16 md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="w-full md:w-1/2">
                                    <img src={item.image} alt={item.title} className="aspect-video w-full rounded-lg object-cover shadow-2xl" />
                                </div>
                                <div className="w-full text-center md:w-1/2 md:text-left">
                                    <h2 className="text-4xl font-light text-[#d4af37]">{item.title}</h2>
                                    <p className="mb-6 text-sm text-[#999]">{item.date}</p>
                                    <p className="text-xl leading-relaxed text-[#666]">{item.memory}</p>
                                </div>
                            </div>
                        </section>
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
            </div>
        </ReactLenis>
    );
}
