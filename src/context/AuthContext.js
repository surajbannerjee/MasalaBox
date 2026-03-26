import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize auth state here. For now simulate quick init.
    const init = async () => {
      setIsLoading(false);
    };
    init();
  }, []);

  const login = (payload) => {
    setUser(payload);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;