'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the user type
type User = {
    email: string;
    username: string;
    password: string;
};

// Define the context type
type UserContextType = {
    user: User | null;
    authToken: string | null;
    setUser: (user: User) => void;
    setAuthToken: (token: string | null) => void;
    logout: () => void;
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null); // Store auth token

    const logout = () => {
        setUser(null);
        setAuthToken(null); // Clear token on logout
    };

    return <UserContext.Provider value={{ user, authToken, setUser, setAuthToken, logout }}>{children}</UserContext.Provider>;
};

// Custom hook for using the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
