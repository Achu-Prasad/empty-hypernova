import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useCursor } from '../context/CursorContext';
import { ArrowUpRight } from 'lucide-react';

const CustomCursor = () => {
    const { cursorType } = useCursor();
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const pathRef = useRef(null);
    const [isMobile, setIsMobile] = useState(true);

    // Store history of points for the line
    const historyRef = useRef([]);
    const MAX_POINTS = 24; // Slightly longer for better taper
    const trailHeadRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const checkMobile = () => {
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            const isSmall = window.innerWidth < 1024;
            setIsMobile(isTouch || isSmall);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const cursor = cursorRef.current;
        const follower = followerRef.current;
        const path = pathRef.current;
        const trailHead = trailHeadRef.current;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        // Initialize history
        for (let i = 0; i < MAX_POINTS; i++) {
            historyRef.current.push({ x: 0, y: 0 });
        }

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const getPoint = (index) => {
            const history = historyRef.current;
            if (index < 0) return history[0];
            if (index >= history.length) return history[history.length - 1];
            return history[index];
        };

        const animate = () => {
            // Main cursor follow
            cursorX += (mouseX - cursorX) * 1;
            cursorY += (mouseY - cursorY) * 1;

            if (cursor) {
                gsap.set(cursor, { x: cursorX, y: cursorY });
            }

            // Follower follow
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;

            if (follower) {
                gsap.set(follower, { x: followerX - 12, y: followerY - 12 });
            }

            // Smooth trail head
            // Lerp the head towards mouse for smoothness
            trailHead.x += (mouseX - trailHead.x) * 0.5;
            trailHead.y += (mouseY - trailHead.y) * 0.5;

            // Update history
            const history = historyRef.current;
            history.pop();
            history.unshift({ x: trailHead.x, y: trailHead.y });

            // Generate Tapered Ribbon Path
            if (path) {
                const widthMax = 4; // Max width at head
                let d = "";

                // Calculate left and right points
                const leftPoints = [];
                const rightPoints = [];

                for (let i = 0; i < history.length; i++) {
                    const current = history[i];
                    const next = getPoint(i + 1);
                    const prev = getPoint(i - 1);

                    // Calculate tangent vector
                    // Use central difference for internal points, forward/backward for ends
                    let tx = 0, ty = 0;

                    if (i === 0) {
                        tx = next.x - current.x;
                        ty = next.y - current.y;
                    } else if (i === history.length - 1) {
                        tx = current.x - prev.x;
                        ty = current.y - prev.y;
                    } else {
                        tx = next.x - prev.x;
                        ty = next.y - prev.y;
                    }

                    // Normalize tangent
                    const len = Math.sqrt(tx * tx + ty * ty);
                    if (len === 0) {
                        tx = 1; ty = 0; // Default if no movement
                    } else {
                        tx /= len;
                        ty /= len;
                    }

                    // Calculate normal (-ty, tx)
                    const nx = -ty;
                    const ny = tx;

                    // Calculate width at this point (taper to 0)
                    const width = widthMax * (1 - i / (history.length - 1));

                    // Offset points
                    leftPoints.push({
                        x: current.x + nx * width,
                        y: current.y + ny * width
                    });
                    rightPoints.push({
                        x: current.x - nx * width,
                        y: current.y - ny * width
                    });
                }

                // Construct Path
                // Start at first left point
                if (leftPoints.length > 0) {
                    d += `M ${leftPoints[0].x} ${leftPoints[0].y}`;

                    // Line to rest of left points
                    for (let i = 1; i < leftPoints.length; i++) {
                        d += ` L ${leftPoints[i].x} ${leftPoints[i].y}`;
                    }

                    // Line to tip (last point is same for left/right effectively as width is 0)
                    // Then back up right side
                    for (let i = rightPoints.length - 1; i >= 0; i--) {
                        d += ` L ${rightPoints[i].x} ${rightPoints[i].y}`;
                    }

                    d += " Z"; // Close path
                    path.setAttribute('d', d);
                }
            }

            requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, [isMobile]);

    // Handle cursor states
    useEffect(() => {
        if (isMobile) return;

        const follower = followerRef.current;
        const cursor = cursorRef.current;
        const path = pathRef.current;

        if (!follower || !cursor) return;

        if (cursorType === 'card-hover') {
            // Card Hover
            gsap.to(follower, {
                scale: 3,
                opacity: 1,
                backgroundColor: 'var(--accent-green)',
                border: 'none',
                duration: 0.3
            });
            gsap.to(cursor, { opacity: 0, duration: 0.2 });
            if (path) gsap.to(path, { opacity: 0, duration: 0.2 });

        } else if (cursorType === 'link-hover') {
            // Link Hover
            gsap.to(follower, {
                scale: 0.5,
                opacity: 0,
                duration: 0.2
            });

            gsap.to(cursor, {
                scale: 2.5,
                opacity: 1,
                duration: 0.15,
                ease: "power2.out"
            });

            if (path) gsap.to(path, { opacity: 0, duration: 0.15 });

        } else {
            // Default
            gsap.to(follower, {
                scale: 0.5,
                opacity: 0,
                duration: 0.3
            });

            gsap.to(cursor, {
                scale: 1,
                opacity: 1,
                duration: 0.2
            });

            if (path) gsap.to(path, { opacity: 1, duration: 0.2 });
        }
    }, [cursorType, isMobile]);

    if (isMobile) return null;

    return (
        <>
            {/* SVG Trail Ribbon */}
            <svg
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    overflow: 'visible'
                }}
            >
                <path
                    ref={pathRef}
                    d=""
                    fill="var(--accent-green)" // Filled shape now
                    stroke="none"
                    style={{ transition: 'opacity 0.2s ease' }}
                />
            </svg>

            {/* Main Cursor Dot */}
            <div
                ref={cursorRef}
                className="custom-cursor-dot"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--text-color)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)'
                }}
            />

            {/* Interactive Follower */}
            <div
                ref={followerRef}
                className="custom-cursor-follower"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '24px',
                    height: '24px',
                    border: '1px solid var(--accent-green)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9997,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    opacity: 0
                }}
            >
                {cursorType === 'card-hover' && (
                    <ArrowUpRight size={8} color="white" className="cursor-icon" />
                )}
            </div>
        </>
    );
};

export default CustomCursor;
