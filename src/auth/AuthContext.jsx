import React, { createContext, useState, useEffect } from 'react';
import { setAppToken, getAppToken, eraseCookie } from '../services/Cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        authorize();
    }, [isLoggedIn]);

    const authorize = () => {
        const token = getAppToken();
        if (token != null) {
            setIsLoggedIn(true);
            return true;
        }
        setIsLoggedIn(false);
        return false;
    }

    const login = (token) => {
        setAppToken(token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        eraseCookie('token');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, authorize, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
