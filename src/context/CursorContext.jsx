import React, { createContext, useContext, useState } from 'react';

const CursorContext = createContext({
    cursorType: 'default',
    setCursorType: () => { },
});

export const useCursor = () => useContext(CursorContext);

export const CursorProvider = ({ children }) => {
    const [cursorType, setCursorType] = useState('default');

    return (
        <CursorContext.Provider value={{ cursorType, setCursorType }}>
            {children}
        </CursorContext.Provider>
    );
};
