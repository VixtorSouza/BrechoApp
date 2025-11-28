import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";

// Configuração do Supabase
const supabaseUrl = "SUA_URL_DO_SUPABASE";
const supabaseAnonKey = "SUA_CHAVE_ANONIMA_DO_SUPABASE";

// Criando um armazenamento personalizado para o AsyncStorage
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Inicializando o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tipos para o Supabase
export type Tables = {
  products: {
    Row: {
      id: string;
      desc: string;
      valor: number;
      tamanho: string;
      status: "disponivel" | "indisponivel" | "esgotado";
      createdAt: string;
      updatedAt: string;
    };
    Insert: Omit<
      {
        id?: string;
        desc: string;
        valor: number;
        tamanho: string;
        status: "disponivel" | "indisponivel" | "esgotado";
        createdAt?: string;
        updatedAt?: string;
      },
      "id" | "createdAt" | "updatedAt"
    >;
    Update: Partial<{
      desc: string;
      valor: number;
      tamanho: string;
      status: "disponivel" | "indisponivel" | "esgotado";
      updatedAt?: string;
    }>;
  };
  // Adicione outras tabelas conforme necessário
};

// Tipos de autenticação
export type AuthSession = {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
};
