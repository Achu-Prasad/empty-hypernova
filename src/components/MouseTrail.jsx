import React, { useState, useEffect, useRef } from 'react';
import trailImage from '../assets/trail.png';

const MouseTrail = () => {
    const [trail, setTrail] = useState([]);
    const requestRef = useRef();
    const trailRef = useRef([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY, movementX, movementY } = e;

            // Calculate angle based on movement direction
            let angle = 0;
            if (Math.abs(movementX) > 0 || Math.abs(movementY) > 0) {
                angle = Math.atan2(movementY, movementX) * (180 / Math.PI);
            }

            const newPoint = {
                x: clientX,
                y: clientY,
                angle: angle,
                id: Date.now() + Math.random(),
                opacity: 1,
                scale: 1,
                createdAt: Date.now()
            };

            trailRef.current = [...trailRef.current, newPoint];
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            const now = Date.now();
            // Filter out old points and update opacity/scale
            trailRef.current = trailRef.current
                .filter(point => now - point.createdAt < 500) // 500ms lifetime
                .map(point => {
                    const age = now - point.createdAt;
                    const life = 1 - (age / 500);
                    return {
                        ...point,
                        opacity: life,
                        scale: life
                    };
                });

            setTrail([...trailRef.current]);
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            {trail.map((point) => (
                <img
                    key={point.id}
                    src={trailImage}
                    alt=""
                    style={{
                        position: 'absolute',
                        left: point.x,
                        top: point.y,
                        transform: `translate(-50%, -50%) rotate(${point.angle}deg) scale(${point.scale})`,
                        opacity: point.opacity,
                        width: '100px', // Adjust size as needed
                        height: 'auto',
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 0 10px rgba(255, 100, 0, 0.5))' // Add some glow
                    }}
                />
            ))}
        </div>
    );
};

export default MouseTrail;
