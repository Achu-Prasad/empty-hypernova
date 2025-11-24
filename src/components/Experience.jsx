import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Search, PenTool, Code, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        id: '01',
        title: 'Discovery',
        description: 'I start by understanding your business, goals, and target audience. This phase is all about research and gathering the right insights to build a solid foundation.',
        icon: <Search size={48} />,
    },
    {
        id: '02',
        title: 'Strategy',
        description: 'Based on the research, I create a strategic roadmap. We define the user journey, information architecture, and core features to ensure the product meets user needs.',
        icon: <PenTool size={48} />,
    },
    {
        id: '03',
        title: 'Design',
        description: 'This is where the magic happens. I craft high-fidelity visuals and interactive prototypes, focusing on aesthetics, usability, and a seamless user experience.',
        icon: <Code size={48} />,
    },
    {
        id: '04',
        title: 'Kick-off',
        description: 'Once I have everything I need, I can begin implementation. I\'ll onboard you as a new client and launch the project. You\'ll receive regular updates, and I guarantee full transparency throughout the entire workflow.',
        icon: <Rocket size={48} />,
    },
    {
        id: '05',
        title: 'Delivery',
        description: 'After rigorous testing and refinement, I deliver the final product. But it doesn\'t end there – I provide support to ensure everything runs smoothly post-launch.',
        icon: <CheckCircle size={48} />,
    },
];

const Experience = () => {
    const containerRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.matchMedia({
                // Desktop: Pin the left side
                "(min-width: 1024px)": function () {
                    ScrollTrigger.create({
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        pin: leftRef.current,
                        pinSpacing: false,
                    });
                },
                // Mobile: No GSAP pinning, rely on CSS sticky
            });

            // Card Triggers
            const steps = rightRef.current.querySelectorAll('.process-step-wrapper');
            steps.forEach((step, index) => {
                ScrollTrigger.create({
                    trigger: step,
                    start: 'top center+=10%', // Trigger when top of wrapper hits slightly below center
                    end: 'bottom center+=10%',
                    onEnter: () => setActiveStep(index),
                    onEnterBack: () => setActiveStep(index),
                });
            });

            // Force refresh after a short delay to ensure layout is settled
            setTimeout(() => ScrollTrigger.refresh(), 100);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="work-process-section" ref={containerRef} id="process">
            <div className="container work-process-container">
                {/* Left Side - Pinned */}
                <div className="process-left" ref={leftRef}>
                    <div className="process-left-content">
                        <div className="mono-label">[My "secret" recipe]</div>
                        <h3 className="process-heading">How I work</h3>

                        <div className="process-indicator">
                            <span className="current-step">0{activeStep + 1}</span>
                            <span className="separator">/</span>
                            <span className="total-steps">0{steps.length}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Scrolling Cards with Details */}
                <div className="process-right" ref={rightRef}>
                    {steps.map((step, index) => (
                        <div key={step.id} className="process-step-wrapper">
                            <div className={`process-card ${index === activeStep ? 'active' : ''}`}>
                                {/* Empty card for video content */}
                                <div className="card-video-placeholder"></div>
                            </div>
                            <div className={`process-step-details ${index === activeStep ? 'active' : ''}`}>
                                <p className="step-description">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
