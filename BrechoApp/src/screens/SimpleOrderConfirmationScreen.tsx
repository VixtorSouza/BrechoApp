import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

export default function OrderConfirmationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { orderId } = (route.params as any) || {};

  const handleTrackOrder = () => {
    // Simular rastreamento - na versão real, abriria uma tela de rastreamento
    Linking.openURL(`https://www.exemplo.com/rastrear/${orderId}`);
  };

  const handleContinueShopping = () => {
    navigation.navigate("MainTabs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.title}>Pedido Confirmado!</Text>
        <Text style={styles.subtitle}>
          Seu pedido foi realizado com sucesso
        </Text>
        <Text style={styles.orderNumber}>
          Número do pedido: #{orderId || Date.now()}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>O que acontece agora?</Text>

        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Confirmação do pagamento</Text>
          </View>
          <Text style={styles.stepDescription}>
            Estamos processando seu pagamento
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Separação dos produtos</Text>
          </View>
          <Text style={styles.stepDescription}>
            Seus produtos estão sendo separados no estoque
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Envio</Text>
          </View>
          <Text style={styles.stepDescription}>
            Os produtos serão enviados para seu endereço
          </Text>
        </View>
      </View>

      <View style={styles.deliveryContainer}>
        <Text style={styles.deliveryTitle}>Previsão de Entrega</Text>
        <Text style={styles.deliveryDate}>3-5 dias úteis</Text>
        <Text style={styles.deliveryAddress}>
          Rua das Flores, 123 - Centro, São Paulo - SP
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleTrackOrder}
        >
          <Text style={styles.secondaryButtonText}>Rastrear Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleContinueShopping}
        >
          <Text style={styles.primaryButtonText}>Continuar Comprando</Text>
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
  successContainer: {
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    padding: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 48,
    color: "#8b5cf6",
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  infoContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  stepContainer: {
    marginBottom: 20,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#8b5cf6",
    color: "white",
    textAlign: "center",
    lineHeight: 30,
    fontWeight: "bold",
    marginRight: 15,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    marginLeft: 45,
  },
  deliveryContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  deliveryDate: {
    fontSize: 18,
    color: "#8b5cf6",
    fontWeight: "bold",
    marginBottom: 10,
  },
  deliveryAddress: {
    fontSize: 14,
    color: "#666",
  },
  actionsContainer: {
    padding: 20,
    gap: 15,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#8b5cf6",
  },
  primaryButton: {
    backgroundColor: "#8b5cf6",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
