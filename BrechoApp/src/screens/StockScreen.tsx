import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts, Product } from "../context/ProductContext";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

type StockScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "StockManagement"
>;

export default function StockScreen() {
  const navigation = useNavigation<StockScreenNavigationProp>();
  const { isAdmin, loading: authLoading } = useAuth();
  const { products, removeProduct, isLoading } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to home if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigation.navigate("ProductList");
    }
  }, [isAdmin, authLoading, navigation]);

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  // If not admin, return null (will be redirected by useEffect)
  if (!isAdmin) {
    return null;
  }

  const handleRefresh = () => {
    setRefreshing(true);
    // Simula um refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja remover este produto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeProduct(productId),
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProduct = (productId: string) => {
    navigation.navigate("ProductForm", { productId });
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.desc}</Text>
        <Text style={styles.itemDetails}>
          Tamanho: {item.tamanho} | Estoque: {item.estoque} | R${" "}
          {item.valor.toFixed(2)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleEditProduct(item.id || "")}
          style={[styles.actionButton, styles.editButton]}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => item.id && handleDeleteProduct(item.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || ""}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("ProductForm", {})}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
    paddingBottom: 100, // Adiciona espaço extra na parte inferior para o FAB não cobrir conteúdo
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80, // Aumentado para ficar acima da tab bar
    backgroundColor: "#8b5cf6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 10, // Garante que o botão fique acima de outros elementos
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
