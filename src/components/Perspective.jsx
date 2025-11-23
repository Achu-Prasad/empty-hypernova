import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Perspective = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    const text = "I'm a designer with a strong foundation in digital design, social media advertising, branding, and motion graphics. I'm currently expanding my skills in UI/UX to better understand how design shapes user experiences and solves real problems. My goal is to create meaningful, impactful designs and collaborate with people who value thoughtful, purposeful creativity.";

    useEffect(() => {
        const container = containerRef.current;
        const chars = textRef.current.querySelectorAll('.char');

        if (!container || chars.length === 0) return;

        let ctx = gsap.context(() => {
            ScrollTrigger.matchMedia({
                // Desktop/Tablet animation (>= 768px)
                "(min-width: 768px)": function () {
                    // Set initial state for animation
                    gsap.set(chars, { opacity: 0.3, color: "var(--text-color)" });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: container,
                            start: "center center",
                            end: "+=200%",
                            scrub: 1,
                            pin: true,
                            pinSpacing: true,
                        }
                    });

                    tl.to(chars, {
                        color: "#2D2D2D",
                        opacity: 1,
                        stagger: 0.05,
                        ease: "none",
                    });
                },
                // Mobile state (< 768px)
                "(max-width: 767px)": function () {
                    // No animation, just dark fill
                    gsap.set(chars, { opacity: 1, color: "#2D2D2D" });
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Split text into words and then characters to preserve word wrapping
    const renderText = () => {
        return text.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                {word.split("").map((char, charIndex) => (
                    <span key={charIndex} className="char">
                        {char}
                    </span>
                ))}
                {/* Add space after word */}
                <span className="char">&nbsp;</span>
            </span>
        ));
    };

    return (
        <section className="perspective-section" ref={containerRef}>
            <div className="container perspective-container">
                <h2 className="perspective-text" ref={textRef}>
                    {renderText()}
                </h2>
            </div>
        </section>
    );
};

export default Perspective;
