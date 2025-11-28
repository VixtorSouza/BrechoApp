import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PRODUCTS_KEY = "@BrechoApp:products";
export const CART_KEY = "@BrechoApp:cart";

// Definição mais robusta de tipos
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
  createdAt?: number;
  updatedAt?: number;
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
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
    isAdmin: boolean
  ) => Promise<void>;
  updateProduct: (
    id: string,
    updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
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
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do AsyncStorage de forma segura
  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [productsData, cartData] = await Promise.all([
        AsyncStorage.getItem(PRODUCTS_KEY),
        AsyncStorage.getItem(CART_KEY),
      ]);

      if (productsData) {
        const parsedProducts = JSON.parse(productsData);
        // Validação básica dos dados
        if (Array.isArray(parsedProducts)) {
          const validatedProducts = parsedProducts.map((p: any) => ({
            ...p,
            id: p.id || Date.now().toString(),
            estoque: Number(p.estoque) || 0,
            valor: Number(p.valor) || 0,
            status: p.estoque > 0 ? "disponivel" : "esgotado",
          }));
          setProducts(validatedProducts);
        }
      }

      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        if (Array.isArray(parsedCart)) {
          // Valida e limpa itens inválidos do carrinho
          const validCartItems = parsedCart.filter(
            (item: any) =>
              item && item.id && item.desc && item.valor !== undefined
          );
          setCart(validCartItems);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Falha ao carregar os dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Persistir alterações no AsyncStorage com debounce
  useEffect(() => {
    if (!isLoading) {
      const saveProducts = async () => {
        try {
          await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        } catch (error) {
          console.error("Erro ao salvar produtos:", error);
          setError("Falha ao salvar alterações dos produtos.");
        }
      };

      const timer = setTimeout(saveProducts, 500); // Debounce de 500ms
      return () => clearTimeout(timer);
    }
  }, [products, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (error) {
          console.error("Erro ao salvar carrinho:", error);
          setError("Falha ao atualizar o carrinho.");
        }
      };

      const timer = setTimeout(saveCart, 500); // Debounce de 500ms
      return () => clearTimeout(timer);
    }
  }, [cart, isLoading]);

  const getProductById = useCallback(
    (id: string): Product | undefined => {
      return products.find((product) => product.id === id);
    },
    [products]
  );

  const addProduct = useCallback(
    async (
      product: Omit<Product, "id" | "createdAt" | "updatedAt">,
      isAdmin: boolean
    ): Promise<void> => {
      if (!isAdmin) {
        throw new Error("Acesso negado: permissão de administrador necessária");
      }

      try {
        const now = Date.now();
        const newProduct: Product = {
          ...product,
          id: `prod_${now}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
          status: product.estoque > 0 ? "disponivel" : "esgotado",
        };

        setProducts((prevProducts) => [...prevProducts, newProduct]);
      } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        throw new Error(
          "Não foi possível adicionar o produto. Tente novamente."
        );
      }
    },
    []
  );

  const updateProduct = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
      isAdmin: boolean
    ): Promise<void> => {
      if (!isAdmin) {
        throw new Error("Acesso negado: permissão de administrador necessária");
      }

      try {
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product.id === id) {
              const updatedProduct = {
                ...product,
                ...updates,
                updatedAt: Date.now(),
                status:
                  updates.estoque !== undefined
                    ? updates.estoque > 0
                      ? "disponivel"
                      : "esgotado"
                    : product.status,
              };
              return updatedProduct;
            }
            return product;
          })
        );
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        throw new Error(
          "Não foi possível atualizar o produto. Tente novamente."
        );
      }
    },
    []
  );

  const removeProduct = useCallback(
    async (id: string, isAdmin: boolean): Promise<void> => {
      if (!isAdmin) {
        throw new Error("Acesso negado: permissão de administrador necessária");
      }

      try {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );

        // Remove também do carrinho se existir
        setCart((prevCart) => {
          const updatedCart = prevCart.filter((item) => item.id !== id);
          return updatedCart;
        });
      } catch (error) {
        console.error("Erro ao remover produto:", error);
        throw new Error("Não foi possível remover o produto. Tente novamente.");
      }
    },
    []
  );

  const addToCart = useCallback(
    async (product: Product, quantity: number = 1): Promise<void> => {
      try {
        if (product.estoque < quantity) {
          throw new Error(
            `Quantidade solicitada indisponível em estoque. Disponível: ${product.estoque}`
          );
        }

        setCart((prevCart) => {
          const existingItemIndex = prevCart.findIndex(
            (item) => item.id === product.id
          );

          if (existingItemIndex >= 0) {
            // Atualiza a quantidade se o item já estiver no carrinho
            const updatedCart = [...prevCart];
            const newQuantity =
              updatedCart[existingItemIndex].quantity + quantity;

            if (product.estoque < newQuantity) {
              throw new Error(
                `Quantidade solicitada excede o estoque disponível.`
              );
            }

            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: newQuantity,
            };
            return updatedCart;
          } else {
            // Adiciona novo item ao carrinho
            const { estoque, ...cartProduct } = product; // Remove estoque do item do carrinho
            return [
              ...prevCart,
              {
                ...cartProduct,
                quantity,
                addedAt: Date.now(),
              },
            ];
          }
        });
      } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
        throw error instanceof Error
          ? error
          : new Error("Falha ao adicionar item ao carrinho.");
      }
    },
    []
  );

  const updateCartItemQuantity = useCallback(
    async (productId: string, quantity: number): Promise<void> => {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) {
        throw new Error("Produto não encontrado");
      }

      if (product.estoque < quantity) {
        throw new Error(
          `Quantidade solicitada indisponível. Disponível: ${product.estoque}`
        );
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    },
    [products]
  );

  const removeFromCart = useCallback(
    async (productId: string): Promise<void> => {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    },
    []
  );

  const clearCart = useCallback(async (): Promise<void> => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback((): number => {
    return cart.reduce((total, item) => total + item.valor * item.quantity, 0);
  }, [cart]);

  const getCartItemCount = useCallback((): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Limpar mensagem de erro após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
