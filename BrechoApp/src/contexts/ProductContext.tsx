import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  visible: boolean;
}

interface ProductContextData {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  toggleProductVisibility: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextData>(
  {} as ProductContextData
);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem("@Brecho:products");
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = async (newProducts: Product[]) => {
    try {
      await AsyncStorage.setItem(
        "@Brecho:products",
        JSON.stringify(newProducts)
      );
      setProducts(newProducts);
    } catch (error) {
      console.error("Error saving products:", error);
      throw error;
    }
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      visible: true,
    };
    await saveProducts([...products, newProduct]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, ...updates } : product
    );
    await saveProducts(updatedProducts);
  };

  const deleteProduct = async (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    await saveProducts(updatedProducts);
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const toggleProductVisibility = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      await updateProduct(id, { visible: !product.visible });
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        toggleProductVisibility,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
