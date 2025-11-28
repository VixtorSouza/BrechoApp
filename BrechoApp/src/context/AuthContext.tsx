import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  user: any;
};

// Mock session type for when Supabase is not configured
type MockSession = {
  user: any;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [useMockAuth, setUseMockAuth] = useState(false);

  useEffect(() => {
    // Tenta verificar se o Supabase está configurado
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id")
          .limit(1);
        if (error) {
          console.log("Supabase não configurado, usando autenticação mock");
          setUseMockAuth(true);
          await loadMockUser();
        } else {
          // Supabase está funcionando, usa autenticação real
          setupRealAuth();
        }
      } catch (error) {
        console.log("Erro ao conectar Supabase, usando autenticação mock");
        setUseMockAuth(true);
        await loadMockUser();
      }
    };

    const loadMockUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@BrechoApp:user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          const mockSession: MockSession = {
            user: userData,
            access_token: "mock_token_stored",
            refresh_token: "mock_refresh_stored",
            expires_in: 3600,
            token_type: "bearer",
          };
          setSession(mockSession as Session);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário mock:", error);
      } finally {
        setLoading(false);
      }
    };

    const setupRealAuth = () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    };

    checkSupabaseConnection();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (useMockAuth) {
      // Autenticação mock simples
      if (email === "admin@brecho.com" && password === "admin123") {
        const mockUser = {
          id: "1",
          email: "admin@brecho.com",
          user_metadata: { full_name: "Administrador" },
        };
        const mockSession: MockSession = {
          user: mockUser,
          access_token: "mock_token_admin",
          refresh_token: "mock_refresh_admin",
          expires_in: 3600,
          token_type: "bearer",
        };
        setUser(mockUser);
        setSession(mockSession as Session);
        await AsyncStorage.setItem("@BrechoApp:user", JSON.stringify(mockUser));
        return { error: null };
      } else if (email && password) {
        const mockUser = {
          id: "2",
          email: email,
          user_metadata: { full_name: "Usuário" },
        };
        const mockSession: MockSession = {
          user: mockUser,
          access_token: "mock_token_user",
          refresh_token: "mock_refresh_user",
          expires_in: 3600,
          token_type: "bearer",
        };
        setUser(mockUser);
        setSession(mockSession as Session);
        await AsyncStorage.setItem("@BrechoApp:user", JSON.stringify(mockUser));
        return { error: null };
      }
      return { error: { message: "Email ou senha inválidos" } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    if (useMockAuth) {
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        user_metadata: { full_name: "Novo Usuário" },
      };
      const mockSession: MockSession = {
        user: mockUser,
        access_token: "mock_token_new",
        refresh_token: "mock_refresh_new",
        expires_in: 3600,
        token_type: "bearer",
      };
      setUser(mockUser);
      setSession(mockSession as Session);
      await AsyncStorage.setItem("@BrechoApp:user", JSON.stringify(mockUser));
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    if (useMockAuth) {
      setUser(null);
      setSession(null);
      await AsyncStorage.removeItem("@BrechoApp:user");
      return;
    }

    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    if (useMockAuth) {
      return { error: null }; // Mock success
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  };

  const updatePassword = async (newPassword: string) => {
    if (useMockAuth) {
      return { error: null }; // Mock success
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
