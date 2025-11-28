import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Perspective = () => {
    const containerRef = useRef(null);


    return (
        <section className="perspective-section" ref={containerRef}>
            <div className="container perspective-container">
                <div className="perspective-content">
                    <h2 className="perspective-text">
                        <span className="text-primary">I am passionate about creating products that users love. </span>
                        <span className="text-secondary">At the same time, I strive to build an environment where product teams can do their best work.</span>
                    </h2>

                    <div className="expertise-section">
                        <h4 className="expertise-label">core expertise</h4>
                        <ul className="expertise-list">
                            {[
                                'Web Design',
                                'Branding',
                                'User Research',
                                'UI Design'
                            ].map((item, index) => (
                                <li key={index} className="expertise-item">
                                    <span className="expertise-title">{item}</span>
                                    <div className="expertise-previews">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="preview-item">
                                                <div className="preview-placeholder"></div>
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Perspective;
