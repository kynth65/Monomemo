import { ScrollAnimation } from '@/components/scroll-animation';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="MONOMEMO - One Memory">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f8f7f5] p-6 text-[#2c2c2c] lg:justify-center lg:p-8">
                {/* Header Navigation */}
                <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="text-sm font-medium tracking-widest">MONOMEMO</div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm bg-[#2c2c2c] px-5 py-1.5 text-sm leading-normal text-white transition-all duration-300 hover:bg-[#d4af37]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block px-5 py-1.5 text-sm leading-normal text-[#2c2c2c] transition-colors hover:text-[#d4af37]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-[#2c2c2c] px-5 py-1.5 text-sm leading-normal text-[#2c2c2c] transition-all hover:bg-[#2c2c2c] hover:text-white"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Main Content */}
                <div className="flex w-full items-center justify-center lg:grow">
                    <main className="flex w-full max-w-[335px] flex-col items-center text-center lg:max-w-7xl">
                        {/* Logo Section */}
                        <ScrollAnimation>
                            <div className="mt-40 mb-74">
                                <h1 className="mb-6 text-6xl leading-none font-extralight tracking-[0.15em] text-[#2c2c2c] lg:text-9xl xl:text-[14rem]">
                                    MONOMEMO
                                </h1>
                                <div className="relative text-3xl font-light tracking-[0.3em] text-[#d4af37] italic lg:text-4xl xl:text-8xl">
                                    <span className="relative z-10">One Memory</span>
                                    <div className="absolute inset-0 top-1/2 h-[1px] w-full -translate-y-1/2 transform bg-[#d4af37] opacity-20"></div>
                                </div>
                            </div>
                        </ScrollAnimation>

                        {/* Main Headline */}
                        <ScrollAnimation className="mb-16" delay={300}>
                            <h2 className="mb-8 max-w-5xl text-4xl leading-[1.1] font-extralight tracking-wide lg:text-6xl xl:text-7xl">
                                MEMORIES THAT
                                <br />
                                <span className="relative font-light text-[#d4af37] italic">
                                    Cherish
                                    <div className="absolute -bottom-2 left-0 h-[2px] w-full bg-gradient-to-r from-[#d4af37] to-transparent opacity-40"></div>
                                </span>
                                <br />
                                OUR MOMENTS
                            </h2>

                            <div className="mx-auto mb-8 h-[1px] w-24 bg-[#d4af37] opacity-60"></div>

                            <p className="mx-auto max-w-3xl text-xl leading-relaxed font-light text-[#666] lg:text-2xl">
                                At MONOMEMO, we believe in the power of singular moments.
                                <br className="hidden lg:block" />
                                One carefully curated album each month, preserving memories
                                <br className="hidden lg:block" />
                                that truly matter without the noise of endless content.
                            </p>
                        </ScrollAnimation>

                        {/* Action Buttons */}
                        <ScrollAnimation className="mb-20" delay={500}>
                            <div className="flex flex-col justify-center gap-6 lg:flex-row">
                                {auth.user ? (
                                    <>
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-block rounded-none border-2 border-[#2c2c2c] bg-[#2c2c2c] px-12 py-4 text-base leading-normal font-medium tracking-wider text-white uppercase transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]"
                                        >
                                            View My Memories
                                        </Link>
                                        <Link
                                            href="#"
                                            className="inline-block rounded-none border-2 border-[#2c2c2c] px-12 py-4 text-base leading-normal font-medium tracking-wider text-[#2c2c2c] uppercase transition-all duration-500 hover:bg-[#2c2c2c] hover:text-white"
                                        >
                                            Create Album
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-none border-2 border-[#2c2c2c] bg-[#2c2c2c] px-12 py-4 text-base leading-normal font-medium tracking-wider text-white uppercase transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]"
                                        >
                                            Start Your Journey
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-block rounded-none border-2 border-[#2c2c2c] px-12 py-4 text-base leading-normal font-medium tracking-wider text-[#2c2c2c] uppercase transition-all duration-500 hover:bg-[#2c2c2c] hover:text-white"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </ScrollAnimation>

                        {/* Feature Points */}
                        <ScrollAnimation className="w-full max-w-6xl" delay={700}>
                            <div className="grid grid-cols-1 gap-20 text-center lg:grid-cols-3 lg:text-left">
                                <div className="group relative">
                                    <div className="absolute -top-6 left-1/2 h-[2px] w-12 -translate-x-1/2 transform bg-[#d4af37] opacity-60 lg:left-0 lg:translate-x-0"></div>
                                    <h3 className="mb-4 text-xl font-light tracking-wide text-[#2c2c2c] uppercase lg:text-2xl">One Album Monthly</h3>
                                    <p className="text-base leading-relaxed font-light text-[#666] lg:text-lg">
                                        Quality over quantity. Each month brings one carefully curated collection of your most precious moments.
                                    </p>
                                </div>

                                <div className="group relative">
                                    <div className="absolute -top-6 left-1/2 h-[2px] w-12 -translate-x-1/2 transform bg-[#d4af37] opacity-60 lg:left-0 lg:translate-x-0"></div>
                                    <h3 className="mb-4 text-xl font-light tracking-wide text-[#2c2c2c] uppercase lg:text-2xl">
                                        Meaningful Curation
                                    </h3>
                                    <p className="text-base leading-relaxed font-light text-[#666] lg:text-lg">
                                        No endless scrolling. Every image is chosen with intention, creating albums that tell your story beautifully.
                                    </p>
                                </div>

                                <div className="group relative">
                                    <div className="absolute -top-6 left-1/2 h-[2px] w-12 -translate-x-1/2 transform bg-[#d4af37] opacity-60 lg:left-0 lg:translate-x-0"></div>
                                    <h3 className="mb-4 text-xl font-light tracking-wide text-[#2c2c2c] uppercase lg:text-2xl">
                                        Timeless Preservation
                                    </h3>
                                    <p className="text-base leading-relaxed font-light text-[#666] lg:text-lg">
                                        Your memories deserve more than fleeting glances. Create lasting collections worth revisiting.
                                    </p>
                                </div>
                            </div>
                        </ScrollAnimation>

                        {/* Stats Section */}
                        <ScrollAnimation className="mt-24 w-full max-w-6xl" delay={900}>
                            <div className="border-t border-[#e0e0e0] pt-16">
                                <div className="grid grid-cols-1 gap-20 text-center lg:grid-cols-3">
                                    <div className="group">
                                        <div className="mb-4 text-5xl font-extralight tracking-wider text-[#d4af37] lg:text-6xl">12</div>
                                        <div className="text-sm font-light tracking-[0.2em] text-[#666] uppercase lg:text-base">Albums Per Year</div>
                                    </div>
                                    <div className="group">
                                        <div className="mb-4 text-5xl font-extralight tracking-wider text-[#d4af37] lg:text-6xl">∞</div>
                                        <div className="text-sm font-light tracking-[0.2em] text-[#666] uppercase lg:text-base">
                                            Memories Preserved
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="mb-4 text-5xl font-extralight tracking-wider text-[#d4af37] lg:text-6xl">1</div>
                                        <div className="text-sm font-light tracking-[0.2em] text-[#666] uppercase lg:text-base">Focus At A Time</div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>

                        {/* Bottom Quote */}
                        <ScrollAnimation className="mt-24" delay={1000}>
                            <div className="mx-auto mb-8 h-[1px] w-32 bg-[#d4af37] opacity-40"></div>
                            <blockquote className="max-w-4xl text-2xl leading-relaxed font-light tracking-wide text-[#999] italic lg:text-3xl">
                                "In a world of countless images, we choose to remember one moment at a time."
                            </blockquote>
                            <div className="mx-auto mt-8 h-[1px] w-32 bg-[#d4af37] opacity-40"></div>
                        </ScrollAnimation>
                    </main>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-xs tracking-wider text-[#999]">MONOMEMO © 2024 | ONE MEMORY, INFINITE VALUE</div>
            </div>
        </>
    );
}
