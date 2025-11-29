import React, { createContext, useContext, useState, useEffect } from 'react';

const CMSContext = createContext();

export const useCMS = () => {
    const context = useContext(CMSContext);
    if (!context) {
        throw new Error('useCMS must be used within a CMSProvider');
    }
    return context;
};

// Initial dummy data to populate if empty
const initialWorks = [
    {
        id: '1',
        title: 'Minimalist E-Commerce',
        subtitle: 'Web Design',
        tags: ['Shopify', 'UX Research'],
        backgroundType: 'color',
        backgroundValue: '#EBEBE6',
        backgroundBlur: 0,
        previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
        content: null
    },
    {
        id: '2',
        title: 'Financial Dashboard',
        subtitle: 'Product Design',
        tags: ['Fintech', 'Data Viz'],
        backgroundType: 'color',
        backgroundValue: '#EBEBE6',
        backgroundBlur: 0,
        previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
        content: null
    },
    {
        id: '3',
        title: 'Travel App Concept',
        subtitle: 'Mobile App',
        tags: ['iOS', 'Prototyping'],
        backgroundType: 'color',
        backgroundValue: '#EBEBE6',
        backgroundBlur: 0,
        previewImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop',
        content: null
    }
];

export const CMSProvider = ({ children }) => {
    const [works, setWorks] = useState(() => {
        const saved = localStorage.getItem('cms_works');
        return saved ? JSON.parse(saved) : initialWorks;
    });

    useEffect(() => {
        console.log('CMSContext: Saving works to localStorage', works);
        localStorage.setItem('cms_works', JSON.stringify(works));
    }, [works]);

    const addWork = (work) => {
        const newWork = { ...work, id: Date.now().toString() };
        setWorks([...works, newWork]);
    };

    const updateWork = (id, updatedData) => {
        console.log('CMSContext: Updating work', id, updatedData);
        setWorks(prevWorks => {
            const newWorks = prevWorks.map(w => w.id === id ? { ...w, ...updatedData } : w);
            console.log('CMSContext: New works state', newWorks);
            return newWorks;
        });
    };

    const deleteWork = (id) => {
        setWorks(prevWorks => {
            const newWorks = prevWorks.filter(w => String(w.id) !== String(id));
            // Also update localStorage immediately to be safe, though useEffect handles it
            return newWorks;
        });
    };

    const getWork = (id) => {
        return works.find(w => String(w.id) === String(id));
    };

    const [isAdmin, setIsAdmin] = useState(() => {
        const savedAuth = localStorage.getItem('cms_auth');
        if (savedAuth) {
            const { token, expiry } = JSON.parse(savedAuth);
            if (new Date().getTime() < expiry) {
                return true;
            }
            localStorage.removeItem('cms_auth');
        }
        return false;
    });

    // Simple SHA-256 hash function for client-side demo
    const sha256 = async (message) => {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const login = async (email, password) => {
        if (email !== import.meta.env.VITE_ADMIN_EMAIL) return false;

        const hashedPassword = await sha256(password);
        if (hashedPassword === import.meta.env.VITE_ADMIN_PASSWORD_HASH) {
            setIsAdmin(true);
            // Save to localStorage with 30-day expiry
            const expiry = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
            localStorage.setItem('cms_auth', JSON.stringify({ token: 'admin-session', expiry }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdmin(false);
        localStorage.removeItem('cms_auth');
    };

    return (
        <CMSContext.Provider value={{ works, addWork, updateWork, deleteWork, getWork, isAdmin, login, logout }}>
            {children}
        </CMSContext.Provider>
    );
};
