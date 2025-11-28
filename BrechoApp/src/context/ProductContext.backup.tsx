import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const PRODUCTS_KEY = "@BrechoApp:products";
export const CART_KEY = "@BrechoApp:cart";

export interface Product {
  id?: string;
  desc: string;
  valor: number;
  tipo: string;
  estoque: number;
  tamanho: string;
  imgSrc: string;
}

export interface CartItem extends Product {}

interface ProductContextValue {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id">, isAdmin: boolean) => Promise<void>;
  updateProduct: (
    id: string,
    updates: Partial<Product>,
    isAdmin: boolean
  ) => Promise<void>;
  removeProduct: (id: string, isAdmin: boolean) => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextValue>(
  {} as ProductContextValue
);

export function useProducts() {
  const context = React.useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carregar dados do AsyncStorage ao iniciar
  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, cartData] = await Promise.all([
          AsyncStorage.getItem(PRODUCTS_KEY),
          AsyncStorage.getItem(CART_KEY),
        ]);

        if (productsData) {
          setProducts(JSON.parse(productsData));
        }
        if (cartData) {
          setCart(JSON.parse(cartData));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Atualizar AsyncStorage quando os dados mudarem
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  const getProductById = (id: string): Product | undefined => {
    return products.find((product) => product.id === id);
  };

  const addProduct = async (
    product: Omit<Product, "id">,
    isAdmin: boolean
  ): Promise<void> => {
    if (!isAdmin) {
      throw new Error("Permissão negada");
    }

    try {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
      };
      const newProducts = [...products, newProduct];
      setProducts(newProducts);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  };

  const updateProduct = async (
    id: string,
    updates: Partial<Product>,
    isAdmin: boolean
  ): Promise<void> => {
    if (!isAdmin) {
      throw new Error("Permissão negada");
    }

    try {
      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  };

  const removeProduct = async (id: string, isAdmin: boolean): Promise<void> => {
    if (!isAdmin) {
      throw new Error("Permissão negada");
    }

    try {
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      // Remove também do carrinho se existir
      const updatedCart = cart.filter((item) => item.id !== id);
      if (updatedCart.length !== cart.length) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      throw error;
    }
  };

  const addToCart = async (product: Product): Promise<void> => {
    try {
      const newCart = [...cart, product];
      setCart(newCart);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string): Promise<void> => {
    try {
      const updatedCart = cart.filter((item) => item.id !== productId);
      setCart(updatedCart);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      throw error;
    }
  };

  const clearCart = async (): Promise<void> => {
    try {
      setCart([]);
      await AsyncStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        cart,
        isLoading,
        addProduct,
        updateProduct,
        removeProduct,
        addToCart,
        removeFromCart,
        clearCart,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
