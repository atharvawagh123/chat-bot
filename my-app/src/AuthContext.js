import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if there's a token in localStorage and set the user
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token }); // You may need to fetch user details if necessary
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
