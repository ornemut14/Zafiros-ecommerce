import { createContext, useContext, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(localStorage.getItem('admin_username'));

  async function login(user, password) {
    const data = await api.login(user, password);
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_username', data.username);
    setUsername(data.username);
  }

  function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ isAdmin: !!username, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
