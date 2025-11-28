import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "../types/models";
import { auth, firestore, usersCollection } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const USER_STORAGE_KEY = "@BrechoEliane:user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from storage on initial load
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();

    // Subscribe to auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userDoc = await usersCollection.doc(firebaseUser.uid).get();
        const userData = userDoc.data() as User;

        const currentUser = {
          id: firebaseUser.uid,
          name: userData?.name || firebaseUser.displayName || "Usuário",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL,
        };

        setUser(currentUser);
        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(currentUser)
        );
      } else {
        // User is signed out
        setUser(null);
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Verificar se é o admin
      if (email === "admin@brecho.com" && password === "1234") {
        const adminUser: User = {
          id: "admin-123",
          name: "Administrador",
          email: "admin@brecho.com",
          isAdmin: true,
        };

        setUser(adminUser);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
        return;
      }

      // Login normal
      const { user: firebaseUser } = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      if (firebaseUser) {
        const userDoc = await usersCollection.doc(firebaseUser.uid).get();
        const userData = userDoc.data() as User;

        const currentUser = {
          id: firebaseUser.uid,
          name: userData?.name || firebaseUser.displayName || "Usuário",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL,
          isAdmin: userData?.isAdmin || false,
        };

        setUser(currentUser);
        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(currentUser)
        );
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(error.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      // Impedir cadastro de novos usuários admin
      if (email === "admin@brecho.com") {
        throw new Error("Não é possível se registrar como administrador");
      }

      setLoading(true);
      const { user: firebaseUser } =
        await auth().createUserWithEmailAndPassword(email, password);

      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          name,
          email,
          createdAt: new Date().toISOString(),
        };

        await usersCollection.doc(firebaseUser.uid).set(userData);

        // Update user profile with display name
        await firebaseUser.updateProfile({
          displayName: name,
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw new Error(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    // TODO: Implement sign out logic
    setUser(null);
  };

  // Verificar se o usuário atual é admin
  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
