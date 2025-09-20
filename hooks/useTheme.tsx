import React, { createContext, useEffect, useContext, useMemo } from 'react';

type Theme = 'light'; // Only 'light' is a valid theme

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void; // Keep for API compatibility, but it will do nothing
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme: Theme = 'light';

    useEffect(() => {
        const root = window.document.documentElement;
        // Always ensure dark mode is off
        root.classList.remove('dark');
        try {
            // Remove any saved theme preference
            localStorage.removeItem('theme');
        } catch (error) {
            console.error("Could not remove theme from localStorage.", error);
        }
    }, []);

    const toggleTheme = () => {
        // This function does nothing now.
        console.log("Dark mode has been removed.");
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
