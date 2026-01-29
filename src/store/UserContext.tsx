import React, { createContext, useContext, useState, useCallback } from "react";
import { User, MOCK_USER } from "../services/types";

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  const setUser = useCallback((newUser: User) => {
    setUserState(newUser);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
