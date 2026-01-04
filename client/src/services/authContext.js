import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect, } from "react";
import apiClient from "./api";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children, }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const checkAuth = useCallback(async () => {
        if (!apiClient.isAuthenticated()) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            const currentUser = await apiClient.getMe();
            setUser(currentUser);
        }
        catch (error) {
            setUser(null);
            apiClient.clearTokens();
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    const register = useCallback(async (email, name, password) => {
        const newUser = await apiClient.register(email, name, password);
        setUser(newUser);
    }, []);
    const login = useCallback(async (email, password) => {
        const loggedInUser = await apiClient.login(email, password);
        setUser(loggedInUser);
    }, []);
    const logout = useCallback(async () => {
        await apiClient.logout();
        setUser(null);
    }, []);
    return (_jsx(AuthContext.Provider, { value: {
            user,
            isAuthenticated: !!user,
            isLoading,
            register,
            login,
            logout,
            checkAuth,
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
