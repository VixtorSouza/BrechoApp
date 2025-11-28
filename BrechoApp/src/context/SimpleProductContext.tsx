import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Product {
  id: string;
  desc: string;
  valor: number;
  tipo: string;
  estoque: number;
  tamanho: string;
  imgSrc: string;
  status?: "disponivel" | "indisponivel" | "esgotado";
}

export interface CartItem extends Omit<Product, "estoque"> {
  quantity: number;
  addedAt: number;
}

interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Sample products
  const sampleProducts: Product[] = [
    {
      id: "1",
      desc: "Vestido Floral Elegante",
      valor: 89.9,
      tipo: "Vestido",
      estoque: 3,
      tamanho: "M",
      imgSrc: "https://picsum.photos/200/200?random=1",
      status: "disponivel",
    },
    {
      id: "2",
      desc: "Blusa Básica Branca",
      valor: 45.0,
      tipo: "Blusa",
      estoque: 5,
      tamanho: "P",
      imgSrc: "https://picsum.photos/200/200?random=2",
      status: "disponivel",
    },
    {
      id: "3",
      desc: "Calça Jeans Azul",
      valor: 120.0,
      tipo: "Calça",
      estoque: 2,
      tamanho: "G",
      imgSrc: "https://picsum.photos/200/200?random=3",
      status: "disponivel",
    },
    {
      id: "4",
      desc: "Saia Midi Estampada",
      valor: 75.5,
      tipo: "Saia",
      estoque: 0,
      tamanho: "M",
      imgSrc: "https://picsum.photos/200/200?random=4",
      status: "esgotado",
    },
    {
      id: "5",
      desc: "Jaqueta Couro Sintético",
      valor: 150.0,
      tipo: "Jaqueta",
      estoque: 1,
      tamanho: "P",
      imgSrc: "https://picsum.photos/200/200?random=5",
      status: "disponivel",
    },
    {
      id: "6",
      desc: "Vestido Preto Festa",
      valor: 200.0,
      tipo: "Vestido",
      estoque: 2,
      tamanho: "G",
      imgSrc: "https://picsum.photos/200/200?random=6",
      status: "disponivel",
    },
    {
      id: "7",
      desc: "Camisa Social Azul",
      valor: 95.0,
      tipo: "Camisa",
      estoque: 4,
      tamanho: "M",
      imgSrc: "https://picsum.photos/200/200?random=7",
      status: "disponivel",
    },
    {
      id: "8",
      desc: "Bermuda Cargo Bege",
      valor: 65.0,
      tipo: "Bermuda",
      estoque: 3,
      tamanho: "P",
      imgSrc: "https://picsum.photos/200/200?random=8",
      status: "disponivel",
    },
  ];

  // Carregar produtos e carrinho do AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar produtos
      const storedProducts = await AsyncStorage.getItem("@BrechoApp:products");
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // Usar produtos de exemplo se não houver nada salvo
        setProducts(sampleProducts);
        await AsyncStorage.setItem(
          "@BrechoApp:products",
          JSON.stringify(sampleProducts)
        );
      }

      // Carregar carrinho
      const storedCart = await AsyncStorage.getItem("@BrechoApp:cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProducts = async (newProducts: Product[]) => {
    try {
      await AsyncStorage.setItem(
        "@BrechoApp:products",
        JSON.stringify(newProducts)
      );
      setProducts(newProducts);
    } catch (error) {
      console.error("Erro ao salvar produtos:", error);
      throw error;
    }
  };

  const saveCart = async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem("@BrechoApp:cart", JSON.stringify(newCart));
      setCart(newCart);
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
      throw error;
    }
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      status: "disponivel" as const,
    };
    await saveProducts([...products, newProduct]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, ...updates } : product
    );
    await saveProducts(updatedProducts);
  };

  const removeProduct = async (id: string) => {
    try {
      console.log("=== INICIANDO EXCLUSÃO ===");
      console.log("ID recebido:", id);
      console.log(
        "Produtos atuais:",
        products.map((p) => ({ id: p.id, desc: p.desc }))
      );

      // Verificar se produto existe
      const productIndex = products.findIndex((p) => p.id === id);
      console.log("Índice do produto:", productIndex);

      if (productIndex === -1) {
        throw new Error(`Produto com ID ${id} não encontrado`);
      }

      // Criar nova lista sem o produto
      const newProducts = [...products];
      newProducts.splice(productIndex, 1);
      console.log("Produtos após remoção:", newProducts.length);

      // Salvar no storage
      await AsyncStorage.setItem(
        "@BrechoApp:products",
        JSON.stringify(newProducts)
      );

      // Atualizar estado imediatamente
      setProducts(newProducts);

      // Remover do carrinho se existir
      const newCart = cart.filter((item) => item.id !== id);
      if (newCart.length !== cart.length) {
        await AsyncStorage.setItem("@BrechoApp:cart", JSON.stringify(newCart));
        setCart(newCart);
      }

      console.log("=== EXCLUSÃO CONCLUÍDA COM SUCESSO ===");
      console.log(
        "Produtos finais:",
        newProducts.map((p) => ({ id: p.id, desc: p.desc }))
      );
    } catch (error) {
      console.error("=== ERRO NA EXCLUSÃO ===", error);
      throw error;
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      await saveCart(updatedCart);
    } else {
      const cartItem: CartItem = {
        ...product,
        quantity,
        addedAt: Date.now(),
      };
      await saveCart([...cart, cartItem]);
    }
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    await saveCart(updatedCart);
  };

  const updateCartItemQuantity = async (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    await saveCart(updatedCart);
  };

  const clearCart = async () => {
    await saveCart([]);
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.valor * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
};
