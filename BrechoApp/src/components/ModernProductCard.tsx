import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../context/SimpleProductContext";

interface Props {
  product: Product;
  onPress(): void;
  onAddToCart?(): void;
}

export function ModernProductCard({ product, onPress, onAddToCart }: Props) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const hasDiscount = product.estoque > 5; // Simulação de desconto para produtos com estoque alto
  const originalPrice = hasDiscount ? product.valor * 1.2 : product.valor;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Badge de desconto */}
      {hasDiscount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-20%</Text>
        </View>
      )}

      {/* Imagem do produto */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imgSrc }} style={styles.image} />

        {/* Badge de estoque */}
        <View
          style={[
            styles.stockBadge,
            { backgroundColor: product.estoque > 0 ? "#10b981" : "#ef4444" },
          ]}
        >
          <Text style={styles.stockText}>
            {product.estoque > 0 ? `${product.estoque} un.` : "Esgotado"}
          </Text>
        </View>
      </View>

      {/* Informações do produto */}
      <View style={styles.infoContainer}>
        {/* Tipo do produto */}
        <Text style={styles.type}>{product.tipo}</Text>

        {/* Nome do produto */}
        <Text style={styles.name} numberOfLines={2}>
          {product.desc}
        </Text>

        {/* Tamanho */}
        <Text style={styles.size}>Tam: {product.tamanho}</Text>

        {/* Preços */}
        <View style={styles.priceContainer}>
          {hasDiscount && (
            <Text style={styles.originalPrice}>
              R$ {formatPrice(originalPrice)}
            </Text>
          )}
          <Text style={styles.currentPrice}>
            R$ {formatPrice(product.valor)}
          </Text>
        </View>

        {/* Botão rápido adicionar ao carrinho */}
        {onAddToCart && product.estoque > 0 && (
          <TouchableOpacity style={styles.quickAddButton} onPress={onAddToCart}>
            <Ionicons name="cart-outline" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    flex: 1,
    maxWidth: 200,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ef4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    backgroundColor: "#f9fafb",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  stockBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 12,
    position: "relative",
  },
  type: {
    fontSize: 11,
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: "500",
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    minHeight: 32,
  },
  size: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: "flex-start",
  },
  originalPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  quickAddButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#8b5cf6",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
