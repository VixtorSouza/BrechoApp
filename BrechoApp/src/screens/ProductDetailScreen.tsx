import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts, Product } from "../context/SimpleProductContext";

type ProductDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

export default function ProductDetailScreen() {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute();
  const { productId } = (route.params as any) || {};
  const { getProductById, addToCart } = useProducts();
  const [product, setProduct] = useState(getProductById(productId));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [productId, getProductById]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product);
        // Navega de volta para a tela principal
        navigation.goBack();
      } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.imgSrc || "https://via.placeholder.com/300" }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.desc}</Text>
        <Text style={styles.price}>R$ {product.valor.toFixed(2)}</Text>
        <Text style={styles.info}>Tamanho: {product.tamanho}</Text>
        <Text style={styles.info}>Tipo: {product.tipo}</Text>
        <Text style={styles.info}>Estoque: {product.estoque} unidades</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Adicionar ao Carrinho"
            onPress={handleAddToCart}
            color="#8b5cf6"
            disabled={product.estoque <= 0}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#f5f5f5",
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    color: "#8b5cf6",
    fontWeight: "bold",
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  buttonContainer: {
    marginTop: 24,
    borderRadius: 8,
    overflow: "hidden",
  },
});
