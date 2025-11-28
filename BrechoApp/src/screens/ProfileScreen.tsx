import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut();
          // Navigation will be handled by the auth state change
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    Alert.alert(
      "Em breve",
      "Funcionalidade de edição de perfil em desenvolvimento."
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Em breve",
      "Funcionalidade de alteração de senha em desenvolvimento."
    );
  };

  const handleOrderHistory = () => {
    Alert.alert("Em breve", "Histórico de pedidos em desenvolvimento.");
  };

  const handleAddresses = () => {
    Alert.alert("Em breve", "Gerenciamento de endereços em desenvolvimento.");
  };

  const handlePaymentMethods = () => {
    Alert.alert("Em breve", "Formas de pagamento em desenvolvimento.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Em breve",
              "Funcionalidade de exclusão de conta em desenvolvimento."
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header com informações do usuário */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#8b5cf6" />
          </View>
          <Text style={styles.userName}>
            {user?.user_metadata?.full_name || "Usuário"}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || "email@exemplo.com"}
          </Text>
        </View>

        {/* Opções do Perfil */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Editar Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleChangePassword}
          >
            <Ionicons name="lock-closed-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Alterar Senha</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOrderHistory}
          >
            <Ionicons name="time-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Histórico de Pedidos</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={handleAddresses}>
            <Ionicons name="location-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Endereços de Entrega</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePaymentMethods}
          >
            <Ionicons name="card-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Formas de Pagamento</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Notificações</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#e0e0e0", true: "#8b5cf6" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Suporte */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Ajuda e Suporte</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Termos de Uso</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Política de Privacidade</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Ações de Conta */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.menuItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
            <Text style={[styles.menuText, styles.dangerText]}>
              Excluir Conta
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    backgroundColor: "white",
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: "#ff4444",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4444",
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
