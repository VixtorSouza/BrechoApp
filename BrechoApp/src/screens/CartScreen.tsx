import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts } from "../context/ProductContext";

export default function CartScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Cart">) {
  const { cart, clearCart } = useProducts();
  const total = cart.reduce((sum, p) => sum + p.valor, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.desc}</Text>
            <Text>R$ {item.valor.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Carrinho vazio</Text>}
      />
      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
      <Button title="Finalizar Pedido" onPress={() => clearCart()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  total: { fontSize: 18, fontWeight: "bold", textAlign: "right" },
});
