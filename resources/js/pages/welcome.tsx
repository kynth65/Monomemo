import { ScrollAnimation } from '@/components/scroll-animation';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ReactLenis } from '@studio-freight/react-lenis';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <ReactLenis root>
            <Head title="MONOMEMO - One Memory">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f8f7f5] p-4 text-[#2c2c2c] sm:p-6 lg:justify-center lg:p-8">
                {/* Header Navigation */}
                <header className="w-full max-w-full px-4 text-sm md:px-6 lg:max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="text-sm font-medium tracking-widest">MONOMEMO</div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm bg-[#2c2c2c] px-4 py-1.5 text-xs leading-normal text-white transition-all duration-300 hover:bg-[#d4af37] sm:px-5 sm:text-sm"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block px-4 py-1.5 text-xs leading-normal text-[#2c2c2c] transition-colors hover:text-[#d4af37] sm:px-5 sm:text-sm"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-[#2c2c2c] px-4 py-1.5 text-xs leading-normal text-[#2c2c2c] transition-all hover:bg-[#2c2c2c] hover:text-white sm:px-5 sm:text-sm"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Main Content */}
                <div className="flex w-full flex-grow items-center justify-center">
                    <main className="flex w-full max-w-full flex-col items-center px-4 text-center md:px-6 lg:max-w-7xl">
                        {/* Logo Section */}
                        <ScrollAnimation>
                            <div className="my-24 sm:my-32 md:my-40 lg:my-48">
                                <h1 className="mb-4 text-5xl leading-none font-extralight tracking-[0.1em] text-[#2c2c2c] sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem]">
                                    MONOMEMO
                                </h1>
                                <div className="relative text-xl font-light tracking-[0.2em] text-[#d4af37] italic sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl">
                                    <span className="relative z-10">One Memory</span>
                                    <div className="absolute inset-0 top-1/2 h-[1px] w-full -translate-y-1/2 transform bg-[#d4af37] opacity-20"></div>
                                </div>
                            </div>
                        </ScrollAnimation>

                        {/* Main Headline */}
                        <ScrollAnimation className="mb-12 sm:mb-16" delay={300}>
                            <h2 className="mb-6 max-w-5xl text-3xl leading-tight font-extralight tracking-wide sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                                FOR MY DEAREST BUBBA,
                                <br />
                                <span className="relative font-light text-[#d4af37] italic">
                                    Georgia
                                    <div className="absolute -bottom-1 left-0 h-[1px] w-full bg-gradient-to-r from-[#d4af37] to-transparent opacity-40 sm:-bottom-2 sm:h-[2px]"></div>
                                </span>
                                <br />
                                LET'S CHERISH OUR MOMENTS
                            </h2>

                            <div className="mx-auto mb-6 h-[1px] w-20 bg-[#d4af37] opacity-60 sm:w-24"></div>

                            <p className="mx-auto max-w-3xl text-base leading-relaxed font-light text-[#666] sm:text-lg md:text-xl lg:text-2xl">
                                I made this little space for us, a place where we can capture the best part of every month.
                                <br className="hidden lg:block" />
                                Just one memory at a time, so we can truly savor it.
                            </p>
                        </ScrollAnimation>

                        {/* Action Buttons */}
                        <ScrollAnimation className="mb-16 sm:mb-20" delay={500}>
                            <div className="flex flex-col justify-center gap-4 sm:gap-6 lg:flex-row">
                                <Link
                                    href={route('our.journey')}
                                    className="inline-block rounded-none border-2 border-[#2c2c2c] bg-[#2c2c2c] px-10 py-3 text-sm leading-normal font-medium tracking-wider text-white uppercase transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37] sm:px-12 sm:py-4 sm:text-base"
                                >
                                    View Our Story
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-none border-2 border-[#2c2c2c] px-10 py-3 text-sm leading-normal font-medium tracking-wider text-[#2c2c2c] uppercase transition-all duration-500 hover:bg-[#2c2c2c] hover:text-white sm:px-12 sm:py-4 sm:text-base"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </ScrollAnimation>

                        {/* Feature Points */}
                        <ScrollAnimation className="w-full max-w-6xl" delay={700}>
                            <div className="grid grid-cols-1 gap-12 text-center sm:gap-16 md:grid-cols-3 md:gap-10 lg:gap-20 lg:text-left">
                                <div className="group relative">
                                    <div className="absolute -top-4 left-1/2 h-[2px] w-10 -translate-x-1/2 transform bg-[#d4af37] opacity-60 sm:-top-6 sm:w-12 md:left-0 md:translate-x-0"></div>
                                    <h3 className="mb-3 text-lg font-light tracking-wide text-[#2c2c2c] uppercase sm:text-xl lg:text-2xl">
                                        One Memory a Month
                                    </h3>
                                    <p className="text-sm leading-relaxed font-light text-[#666] sm:text-base lg:text-lg">
                                        Let's choose our favorite moment each month. No pressure, just pure joy and a beautiful collection of our time
                                        together.
                                    </p>
                                </div>

                                <div className="group relative">
                                    <div className="absolute -top-4 left-1/2 h-[2px] w-10 -translate-x-1/2 transform bg-[#d4af37] opacity-60 sm:-top-6 sm:w-12 md:left-0 md:translate-x-0"></div>
                                    <h3 className="mb-3 text-lg font-light tracking-wide text-[#2c2c2c] uppercase sm:text-xl lg:text-2xl">
                                        A Story of Us
                                    </h3>
                                    <p className="text-sm leading-relaxed font-light text-[#666] sm:text-base lg:text-lg">
                                        This isn't about endless photos. It's about creating a story, our story, one meaningful memory at a time.
                                    </p>
                                </div>

                                <div className="group relative">
                                    <div className="absolute -top-4 left-1/2 h-[2px] w-10 -translate-x-1/2 transform bg-[#d4af37] opacity-60 sm:-top-6 sm:w-12 md:left-0 md:translate-x-0"></div>
                                    <h3 className="mb-3 text-lg font-light tracking-wide text-[#2c2c2c] uppercase sm:text-xl lg:text-2xl">
                                        Forever & Always
                                    </h3>
                                    <p className="text-sm leading-relaxed font-light text-[#666] sm:text-base lg:text-lg">
                                        Building a lifetime of memories starts with cherishing the small moments. This is for us, for our future, for
                                        always.
                                    </p>
                                </div>
                            </div>
                        </ScrollAnimation>

                        {/* Stats Section */}
                        <ScrollAnimation className="mt-20 w-full max-w-6xl sm:mt-24" delay={900}>
                            <div className="border-t border-[#e0e0e0] pt-12 sm:pt-16">
                                <div className="grid grid-cols-1 gap-12 text-center sm:gap-16 md:grid-cols-3 md:gap-10">
                                    <div className="group">
                                        <div className="mb-2 text-4xl font-extralight tracking-wider text-[#d4af37] sm:text-5xl lg:text-6xl">12</div>
                                        <div className="text-xs font-light tracking-[0.2em] text-[#666] uppercase sm:text-sm lg:text-base">
                                            Chapters a Year
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="mb-2 text-4xl font-extralight tracking-wider text-[#d4af37] sm:text-5xl lg:text-6xl">∞</div>
                                        <div className="text-xs font-light tracking-[0.2em] text-[#666] uppercase sm:text-sm lg:text-base">
                                            Memories Together
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="mb-2 text-4xl font-extralight tracking-wider text-[#d4af37] sm:text-5xl lg:text-6xl">1</div>
                                        <div className="text-xs font-light tracking-[0.2em] text-[#666] uppercase sm:text-sm lg:text-base">
                                            Focus on Us
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>

                        {/* Bottom Quote */}
                        <ScrollAnimation className="mt-20 sm:mt-24" delay={1000}>
                            <div className="mx-auto mb-6 h-[1px] w-24 bg-[#d4af37] opacity-40 sm:mb-8 sm:w-32"></div>
                            <blockquote className="max-w-4xl text-xl leading-relaxed font-light tracking-wide text-[#999] italic sm:text-2xl lg:text-3xl">
                                "For all the moments we can't get back, and for all the ones we have yet to make. This is for you, Bubba."
                            </blockquote>
                            <div className="mx-auto mt-6 h-[1px] w-24 bg-[#d4af37] opacity-40 sm:mt-8 sm:w-32"></div>
                        </ScrollAnimation>
                    </main>
                </div>

                {/* Footer Info */}
                <div className="mt-12 pb-4 text-center text-xs tracking-wider text-[#999]">
                    MONOMEMO | MADE WITH LOVE FOR MY BUBBA
                </div>
            </div>
        </ReactLenis>
    );
}
