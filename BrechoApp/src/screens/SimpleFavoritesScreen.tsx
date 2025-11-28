import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts } from "../context/SimpleProductContext";

export default function FavoritesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { products } = useProducts();

  // Simulando favoritos - na versão real, isso viria do AsyncStorage
  const [favorites, setFavorites] = useState<string[]>(["1", "3", "5"]);

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.id })
      }
    >
      <Image source={{ uri: item.imgSrc }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.desc}</Text>
        <Text style={styles.productType}>{item.tipo}</Text>
        <Text style={styles.productPrice}>R$ {item.valor.toFixed(2)}</Text>
        <Text
          style={[
            styles.stockStatus,
            { color: item.estoque > 0 ? "#4CAF50" : "#f44336" },
          ]}
        >
          {item.estoque > 0 ? `${item.estoque} em estoque` : "Esgotado"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <Text style={styles.favoriteButtonText}>
          {favorites.includes(item.id) ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Favoritos</Text>
        <Text style={styles.subtitle}>
          {favoriteProducts.length}{" "}
          {favoriteProducts.length === 1 ? "produto" : "produtos"}
        </Text>
      </View>

      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não tem favoritos</Text>
            <Text style={styles.emptySubtext}>
              Toque no coração nos produtos para adicioná-los aos favoritos
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#8b5cf6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 8,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "bold",
    marginBottom: 5,
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: "bold",
  },
  favoriteButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
