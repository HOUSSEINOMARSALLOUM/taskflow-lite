import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import apiClient from "./api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (email: string, name: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
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
    } catch (error) {
      setUser(null);
      apiClient.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const register = useCallback(
    async (email: string, name: string, password: string) => {
      const newUser = await apiClient.register(email, name, password);
      setUser(newUser);
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await apiClient.login(email, password);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    await apiClient.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
