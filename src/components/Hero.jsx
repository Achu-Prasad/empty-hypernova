import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const worksData = [
    {
        id: 1,
        title: 'Minimalist E-Commerce',
        subtitle: 'Web Design',
        tags: ['Shopify', 'UX Research'],
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
        backgroundColor: '#EBEBE6',
    },
    {
        id: 2,
        title: 'Financial Dashboard',
        subtitle: 'Product Design',
        tags: ['Fintech', 'Data Viz'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
        backgroundColor: '#F0EFEA',
    },
    {
        id: 3,
        title: 'Travel App Concept',
        subtitle: 'Mobile App',
        tags: ['iOS', 'Prototyping'],
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop',
        backgroundColor: '#E6E8EB',
    },
    {
        id: 4,
        title: 'Brand Identity System',
        subtitle: 'Branding',
        tags: ['Identity', 'Strategy'],
        image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop',
        backgroundColor: '#F2EBE9',
    },
    {
        id: 5,
        title: 'Health & Wellness App',
        subtitle: 'Mobile App',
        tags: ['Android', 'User Testing'],
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
        backgroundColor: '#E8F1F2',
    },
    {
        id: 6,
        title: 'Modern Architecture',
        subtitle: 'Photography',
        tags: ['Art Direction', 'Editorial'],
        image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1000&auto=format&fit=crop',
        backgroundColor: '#F5F5F5',
    },
    {
        id: 7,
        title: 'Tech Startup Landing',
        subtitle: 'Web Design',
        tags: ['SaaS', 'Conversion'],
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
        backgroundColor: '#E0E7FF',
    },
];

// Duplicate for infinite scroll (3 sets to ensure smooth looping)
const works = [...worksData, ...worksData, ...worksData];

const Hero = () => {
    const [hoveredWork, setHoveredWork] = useState(null);
    const scrollRef = useRef(null);
    const isHovering = useRef(false);
    const isManualScrolling = useRef(false);
    const scrollTimeout = useRef(null);
    const autoScrollTween = useRef(null);
    const nextStepTimeout = useRef(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        // Initialize scroll position to the start of the second set
        setTimeout(() => {
            if (container) {
                container.scrollLeft = container.scrollWidth / 3;
            }
            startAutoScrollCycle();
        }, 100);

        return () => {
            killAnimations();
        };
    }, []);

    const killAnimations = () => {
        if (scrollRef.current) {
            gsap.killTweensOf(scrollRef.current);
        }
        if (nextStepTimeout.current) clearTimeout(nextStepTimeout.current);
    };

    const startAutoScrollCycle = () => {
        killAnimations();

        // Buffer time before next move
        nextStepTimeout.current = setTimeout(() => {
            if (isHovering.current || isManualScrolling.current) {
                // If blocked, check again in a bit
                startAutoScrollCycle();
                return;
            }
            animateToNextCard();
        }, 2000); // 2 second buffer
    };

    const animateToNextCard = () => {
        const container = scrollRef.current;
        if (!container) return;

        const cardWidth = 600;
        const gap = 24; // 1.5rem = 24px
        const step = cardWidth + gap;

        const currentScroll = container.scrollLeft;
        const nextScroll = Math.round(currentScroll / step) * step + step;

        // Infinite loop check
        const maxScroll = (container.scrollWidth / 3) * 2;

        if (currentScroll >= maxScroll) {
            // Snap back to start of middle set
            container.scrollLeft = currentScroll - (container.scrollWidth / 3);
            // Then animate from there
            const adjustedStart = container.scrollLeft;
            const adjustedNext = adjustedStart + step;

            performScrollAnimation(container, adjustedNext);
        } else {
            performScrollAnimation(container, nextScroll);
        }
    };

    const performScrollAnimation = (container, targetX) => {
        autoScrollTween.current = gsap.to(container, {
            scrollLeft: targetX,
            duration: 0.6, // Faster, smoother move
            ease: "power2.out", // Snappier ease
            onComplete: () => {
                startAutoScrollCycle();
            }
        });
    };

    const onUserInteractionStart = () => {
        isManualScrolling.current = true;
        killAnimations();
    };

    const onUserInteractionEnd = () => {
        // Debounce the end of interaction
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            isManualScrolling.current = false;
            startAutoScrollCycle(); // Resume
        }, 500); // Wait 0.5s after last interaction to resume
    };

    return (
        <section className="hero-section">
            <div className="container hero-custom-margin">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-header"
                >
                    <span className="mono subtitle">Portfolio 2025</span>
                    <h1 className="hero-title">
                        Designing with <br />
                        <span className="highlight">purpose</span> & personality.
                    </h1>
                </motion.div>
            </div>
            <div
                className="works-grid"
                ref={scrollRef}
                onMouseEnter={() => {
                    isHovering.current = true;
                    killAnimations();
                }}
                onMouseLeave={() => {
                    isHovering.current = false;
                    startAutoScrollCycle();
                }}
                onWheel={() => {
                    onUserInteractionStart();
                    onUserInteractionEnd();
                }}
                onTouchStart={() => {
                    onUserInteractionStart();
                }}
                onTouchMove={() => {
                    onUserInteractionStart();
                    onUserInteractionEnd();
                }}
                onMouseDown={() => {
                    onUserInteractionStart();
                }}
            >
                {works.map((work, index) => (
                    <motion.div
                        key={`${work.id}-${index}`}
                        className="work-card"
                        style={{ backgroundColor: work.backgroundColor }}
                        onHoverStart={() => setHoveredWork(work.id)}
                        onHoverEnd={() => setHoveredWork(null)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                        <div className="work-content">
                            <div className="work-header">
                                <h3 className="work-title">{work.title}</h3>
                                <div className="work-meta">
                                    <span className="work-subtitle">{work.subtitle}</span>
                                    <div className="work-tags">
                                        {work.tags.map((tag, idx) => (
                                            <span key={idx} className="work-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="work-image-container">
                                <img
                                    src={work.image}
                                    alt={work.title}
                                    className="work-image"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Hero;
