import React from "react";
import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import { Product } from "../context/SimpleProductContext";

interface Props {
  product: Product;
  onPress(): void;
}

export function ProductCard({ product, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.imgSrc }} style={styles.image} />
      <Text style={styles.title}>{product.desc}</Text>
      <Text style={styles.price}>R$ {product.valor.toFixed(2)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  image: { width: "100%", aspectRatio: 1, borderRadius: 6, marginBottom: 6 },
  title: { fontWeight: "bold", marginBottom: 4, textAlign: "center" },
  price: { color: "#4b5563" },
});
