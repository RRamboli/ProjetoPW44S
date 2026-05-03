import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser?: AuthenticatedUser;
  handleLogin: (authenticationResponse: AuthenticationResponse) => Promise<any>;
  handleLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      // Parse stored user and ensure id is present (maybe stored separately as userId)
      let parsedUser: any = {};
      try {
        parsedUser = JSON.parse(storedUser as string) || {};
      } catch {
        parsedUser = {};
      }

      // Try to fill id from localStorage.userId when missing on the stored user
      const storedUserId = localStorage.getItem("userId");
      if ((!parsedUser.id || parsedUser.id === null) && storedUserId) {
        const num = Number(storedUserId);
        if (!Number.isNaN(num)) parsedUser.id = num;
      }

      setAuthenticatedUser(parsedUser);
      setAuthenticated(true);

      // Normalize token in case it was stored stringified previously
      let token = storedToken;
      try {
        token = JSON.parse(storedToken as string);
      } catch {
        token = storedToken as string;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (
    authenticationResponse: AuthenticationResponse
  ) => {
    try {
      // Save token as plain string and also persist userId for convenience
      localStorage.setItem("token", authenticationResponse.token);

      // Normalize user object: ensure .id exists using authenticationResponse.userId when necessary
      const userObj: any = authenticationResponse.user ? { ...authenticationResponse.user } : {};
      const uid = authenticationResponse.userId ?? userObj?.id;
      if (uid !== undefined && uid !== null) {
        // store userId separately for backward compatibility
        localStorage.setItem("userId", String(uid));
        // ensure user object has numeric id
        if (!userObj.id) userObj.id = Number(uid);
      }

      localStorage.setItem("user", JSON.stringify(userObj));
      api.defaults.headers.common["Authorization"] = `Bearer ${authenticationResponse.token}`;

      setAuthenticatedUser(userObj);
      setAuthenticated(true);
    } catch {
      setAuthenticatedUser(undefined);
      setAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    api.defaults.headers.common["Authorization"] = "";

    setAuthenticated(false);
    setAuthenticatedUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, authenticatedUser, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };