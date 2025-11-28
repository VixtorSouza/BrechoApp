import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../config/supabase";
import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CART_KEY = "@BrechoApp:cart";

export type ProductStatus = "disponivel" | "indisponivel" | "esgotado";

export interface Product {
  id: string;
  desc: string;
  valor: number;
  tipo: string;
  estoque: number;
  tamanho: string;
  imgSrc: string;
  status?: ProductStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Omit<Product, "estoque"> {
  quantity: number;
  addedAt: number;
}

interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  addProduct: (
    product: Omit<Product, "id" | "created_at" | "updated_at">,
    isAdmin: boolean
  ) => Promise<void>;
  updateProduct: (
    id: string,
    updates: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
    isAdmin: boolean
  ) => Promise<void>;
  removeProduct: (id: string, isAdmin: boolean) => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (
    productId: string,
    quantity: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar carrinho do AsyncStorage
  const loadCart = useCallback(async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_KEY);
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    }
  }, []);

  // Carregar produtos do Supabase
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      // Tenta carregar do Supabase primeiro
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Mapear os dados do Supabase para o formato esperado
        const formattedProducts = data.map((product: Product) => ({
          ...product,
          status: getProductStatus(
            product.estoque,
            product.status as ProductStatus
          ),
        }));

        setProducts(formattedProducts);
        return;
      } catch (supabaseError) {
        console.log("Supabase não configurado, usando dados de exemplo");
      }

      // Dados de exemplo caso o Supabase não funcione
      const sampleProducts: Product[] = [
        {
          id: "1",
          desc: "Vestido Floral Elegante",
          valor: 89.9,
          tipo: "Vestido",
          estoque: 3,
          tamanho: "M",
          imgSrc:
            "https://via.placeholder.com/200x200/FFC0CB/000000?Text=Vestido+Floral",
          status: "disponivel",
        },
        {
          id: "2",
          desc: "Blusa Básica Branca",
          valor: 45.0,
          tipo: "Blusa",
          estoque: 5,
          tamanho: "P",
          imgSrc:
            "https://via.placeholder.com/200x200/FFFFFF/000000?Text=Blusa+Branca",
          status: "disponivel",
        },
        {
          id: "3",
          desc: "Calça Jeans Azul",
          valor: 120.0,
          tipo: "Calça",
          estoque: 2,
          tamanho: "G",
          imgSrc:
            "https://via.placeholder.com/200x200/0000FF/FFFFFF?Text=Calça+Jeans",
          status: "disponivel",
        },
        {
          id: "4",
          desc: "Saia Midi Estampada",
          valor: 75.5,
          tipo: "Saia",
          estoque: 0,
          tamanho: "M",
          imgSrc:
            "https://via.placeholder.com/200x200/FF69B4/FFFFFF?Text=Saia+Midi",
          status: "esgotado",
        },
        {
          id: "5",
          desc: "Jaqueta Couro Sintético",
          valor: 150.0,
          tipo: "Jaqueta",
          estoque: 1,
          tamanho: "P",
          imgSrc:
            "https://via.placeholder.com/200x200/000000/FFFFFF?Text=Jaqueta",
          status: "disponivel",
        },
      ];

      setProducts(sampleProducts);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setError("Erro ao carregar produtos. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função auxiliar para determinar o status do produto
  const getProductStatus = (
    estoque: number,
    currentStatus?: ProductStatus
  ): ProductStatus => {
    if (currentStatus === "indisponivel") return "indisponivel";
    return estoque > 0 ? "disponivel" : "esgotado";
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    fetchProducts();
    loadCart();
  }, [fetchProducts, loadCart]);

  // Atualizar o carrinho no AsyncStorage sempre que ele mudar
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Erro ao salvar carrinho:", error);
      }
    };

    saveCart();
  }, [cart]);

  // Adicionar produto (apenas admin)
  const addProduct = async (
    product: Omit<Product, "id" | "created_at" | "updated_at">,
    isAdmin: boolean
  ) => {
    if (!isAdmin) {
      throw new Error(
        "Acesso negado. Apenas administradores podem adicionar produtos."
      );
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            ...product,
            status: getProductStatus(product.estoque),
          },
        ])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setProducts((prev) => [data[0], ...prev]);
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  };

  // Atualizar produto (apenas admin)
  const updateProduct = async (
    id: string,
    updates: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
    isAdmin: boolean
  ) => {
    if (!isAdmin) {
      throw new Error(
        "Acesso negado. Apenas administradores podem atualizar produtos."
      );
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          status:
            updates.estoque !== undefined
              ? getProductStatus(updates.estoque, updates.status)
              : undefined,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...data[0] } : p))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  };

  // Remover produto (apenas admin)
  const removeProduct = async (id: string, isAdmin: boolean) => {
    if (!isAdmin) {
      throw new Error(
        "Acesso negado. Apenas administradores podem remover produtos."
      );
    }

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      // Remover do carrinho se estiver lá
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      throw error;
    }
  };

  // Adicionar ao carrinho
  const addToCart = async (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // Atualizar quantidade se o item já estiver no carrinho
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                addedAt: Date.now(),
              }
            : item
        );
      } else {
        // Adicionar novo item ao carrinho
        const { estoque, ...cartItem } = product;
        return [...prev, { ...cartItem, quantity, addedAt: Date.now() }];
      }
    });
  };

  // Remover do carrinho
  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Atualizar quantidade no carrinho
  const updateCartItemQuantity = async (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  // Limpar carrinho
  const clearCart = async () => {
    setCart([]);
  };

  // Obter produto por ID
  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  // Calcular total do carrinho
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.valor * item.quantity, 0);
  };

  // Contar itens no carrinho
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Atualizar lista de produtos
  const refreshProducts = async () => {
    await fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        cart,
        isLoading,
        error,
        addProduct,
        updateProduct,
        removeProduct,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getProductById,
        getCartTotal,
        getCartItemCount,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
