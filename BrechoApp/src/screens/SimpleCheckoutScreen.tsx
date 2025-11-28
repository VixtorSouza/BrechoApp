import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts } from "../context/SimpleProductContext";

export default function CheckoutScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { cart, getCartTotal, clearCart } = useProducts();
  const total = getCartTotal();

  const handleCheckout = () => {
    Alert.alert(
      "Confirmar Pedido",
      `Total: R$ ${total.toFixed(2)}\n\nDeseja confirmar sua compra?`,
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
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.desc}</Text>
        <Text style={styles.itemDetails}>
          Tamanho: {item.tamanho} | Quantidade: {item.quantity}
        </Text>
        <Text style={styles.itemPrice}>
          R$ {(item.valor * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Compra</Text>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.desc}</Text>
                <Text style={styles.itemDetails}>
                  {item.tamanho} | {item.quantity}x R$ {item.valor.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                R$ {(item.valor * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Entrega</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Endereço: Rua das Flores, 123</Text>
            <Text style={styles.infoText}>Bairro: Centro</Text>
            <Text style={styles.infoText}>Cidade: São Paulo - SP</Text>
            <Text style={styles.infoText}>CEP: 01234-567</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity style={styles.paymentOption}>
              <Text style={styles.paymentOptionText}>Cartão de Crédito</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.paymentOption, styles.selected]}>
              <Text style={[styles.paymentOptionText, styles.selectedText]}>
                PIX
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption}>
              <Text style={styles.paymentOptionText}>Dinheiro</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>R$ {total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frete:</Text>
            <Text style={styles.summaryValue}>R$ 10.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {(total + 10).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Confirmar Compra - R$ {(total + 10).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 15,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentOption: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: "#8b5cf6",
  },
  paymentOptionText: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "white",
  },
  summary: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  footer: {
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  checkoutButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
