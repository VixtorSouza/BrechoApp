import React from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts } from "../context/SimpleProductContext";

export default function CartScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
  } = useProducts();
  const total = getCartTotal();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert(
        "Carrinho Vazio",
        "Adicione produtos ao carrinho antes de finalizar a compra."
      );
      return;
    }

    Alert.alert(
      "Finalizar Compra",
      `Total: R$ ${total.toFixed(2)}\n\nDeseja confirmar a compra?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            clearCart();
            navigation.navigate("OrderConfirmation", {
              orderId: Date.now().toString(),
            });
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imgSrc }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.desc}</Text>
        <Text style={styles.itemPrice}>R$ {item.valor.toFixed(2)}</Text>
        <Text style={styles.itemSize}>Tamanho: {item.tamanho}</Text>
        <Text style={styles.itemQuantity}>Quantidade: {item.quantity}</Text>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => {
            Alert.alert(
              "Comprar Produto",
              `Deseja confirmar a compra de ${item.desc}?`,
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Comprar",
                  onPress: () => {
                    removeFromCart(item.id);
                    Alert.alert("Sucesso!", "Compra confirmada com sucesso!");
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Carrinho</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
            <Button
              title="Continuar Comprando"
              onPress={() => navigation.goBack()}
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
          <Button
            title="Finalizar Compra"
            onPress={handleCheckout}
            color="#8b5cf6"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
    color: "#333",
  },
  cartItem: {
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
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemSize: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#8b5cf6",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  removeButtonText: {
    fontSize: 20,
    color: "#ff4444",
    fontWeight: "bold",
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
    marginBottom: 20,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
});
