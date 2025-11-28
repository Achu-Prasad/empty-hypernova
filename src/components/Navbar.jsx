import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileImg from '../assets/profile.png';
import { useCursor } from '../context/CursorContext';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
    { id: 'about', label: 'About' },
    { id: 'works', label: 'Works' },
    { id: 'playground', label: 'Playbook' },
];

const Navbar = () => {
    const [time, setTime] = useState(new Date());
    const navRef = useRef(null);
    const { setCursorType } = useCursor();

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const updateScrollbarWidth = () => {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
        };

        updateScrollbarWidth();
        window.addEventListener('resize', updateScrollbarWidth);

        /*
        const showAnim = gsap.from(navRef.current, {
            yPercent: -100,
            paused: true,
            duration: 0.2
        }).progress(1);

        ScrollTrigger.create({
            start: "top top",
            end: 99999,
            onUpdate: (self) => {
                if (self.direction === -1) {
                    showAnim.play();
                    document.body.classList.remove('nav-hidden');
                } else {
                    showAnim.reverse();
                    document.body.classList.add('nav-hidden');
                }
            }
        });
        */

        return () => window.removeEventListener('resize', updateScrollbarWidth);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-GB', { hour12: false }); // HH:MM:SS 24h format
    };

    return (
        <div className="navbar-container glass-effect" ref={navRef}>
            <motion.nav
                className="navbar"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="nav-left">
                    <div className="nav-profile">
                        <img src={profileImg} alt="Profile" className="profile-img" />
                        <div className="profile-text">
                            <span className="portfolio-of">portfolio of</span>
                            <span className="profile-name">Achu Prasad</span>
                        </div>
                    </div>
                    <div className="nav-links">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="nav-link"
                                onMouseEnter={() => setCursorType('link-hover')}
                                onMouseLeave={() => setCursorType('default')}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="nav-right">
                    <div className="nav-info">
                        <span className="nav-location">Bengaluru, IN</span>
                        <span className="nav-time">{formatTime(time)}</span>
                    </div>
                </div>
            </motion.nav>
        </div>
    );
};

export default Navbar;
