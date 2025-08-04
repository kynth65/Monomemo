import { useState, useRef, useEffect, type ReactNode } from 'react';

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function ScrollAnimation({ children, className, delay = 0 }: ScrollAnimationProps) {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    const transitionDelay = `${delay}ms`;

    return (
        <div
            ref={elementRef}
            className={`${className ?? ''} transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
            }`}
            style={{ transitionDelay }}
        >
            {children}
        </div>
    );
}