import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, TabParamList } from "../types/navigation";
import { useProducts, Product } from "../context/SimpleProductContext";
import { ModernProductCard } from "../components/ModernProductCard";
import { Toast } from "../components/Toast";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ModernCatalogScreen() {
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList> &
      BottomTabNavigationProp<TabParamList>
  >();
  const { products, addToCart } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortBy, setSortBy] = useState("nome");
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });
  const insets = useSafeAreaInsets();

  // Categorias disponíveis
  const categories = useMemo(() => {
    const cats = ["todos"];
    const uniqueTypes = [...new Set(products.map((p) => p.tipo))];
    cats.push(...uniqueTypes);
    return cats;
  }, [products]);

  // Produtos filtrados e ordenados
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(
      (product) =>
        product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tipo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filtrar por categoria
    if (selectedCategory !== "todos") {
      filtered = filtered.filter((p) => p.tipo === selectedCategory);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "preco-menor":
          return a.valor - b.valor;
        case "preco-maior":
          return b.valor - a.valor;
        case "estoque":
          return b.estoque - a.estoque;
        default: // nome
          return a.desc.localeCompare(b.desc);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  const handleQuickAddToCart = async (product: Product) => {
    try {
      await addToCart(product, 1);
      setToast({
        visible: true,
        message: `${product.desc} adicionado ao carrinho!`,
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setToast({
        visible: true,
        message: "Erro ao adicionar ao carrinho",
        type: "error",
      });
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ModernProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      onAddToCart={() => handleQuickAddToCart(item)}
    />
  );

  const renderCategoryChip = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        {
          backgroundColor:
            selectedCategory === category ? "#8b5cf6" : "#f3f4f6",
        },
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryChipText,
          { color: selectedCategory === category ? "#fff" : "#374151" },
        ]}
      >
        {category === "todos" ? "Todos" : category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#8b5cf6" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Brechó da Eliane</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="filter" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("Cart")}
            >
              <Ionicons name="cart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros e Categorias */}
      <View style={styles.filtersSection}>
        {/* Categorias */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>

        {/* Opções de ordenação */}
        {showFilters && (
          <View style={styles.sortOptions}>
            <Text style={styles.sortTitle}>Ordenar por:</Text>
            <View style={styles.sortButtons}>
              {[
                { key: "nome", label: "Nome" },
                { key: "preco-menor", label: "Menor Preço" },
                { key: "preco-maior", label: "Maior Preço" },
                { key: "estoque", label: "Estoque" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortButton,
                    {
                      backgroundColor:
                        sortBy === option.key ? "#8b5cf6" : "#f3f4f6",
                    },
                  ]}
                  onPress={() => setSortBy(option.key)}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      { color: sortBy === option.key ? "#fff" : "#374151" },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Resultados */}
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredAndSortedProducts.length} produtos encontrados
          </Text>
          {searchQuery.length > 0 && (
            <Text style={styles.searchTerm}>para "{searchQuery}"</Text>
          )}
        </View>

        <FlatList
          data={filteredAndSortedProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
              <Text style={styles.emptyDescription}>
                Tente usar outros termos de busca ou filtros
              </Text>
            </View>
          }
        />
      </View>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  filtersSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sortOptions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  searchTerm: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  productsList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});
