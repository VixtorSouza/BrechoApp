import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  DefaultTheme,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList, TabParamList } from "../types/navigation";

// Screens
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CartScreen from "../screens/CartScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import AddProductScreen from "../screens/AddProductScreen";
import StockScreen from "../screens/StockScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Catalog":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Cart":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Favorites":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#8b5cf6",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{ title: "Início" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Buscar" }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Carrinho",
          tabBarBadge: 0, // Será atualizado dinamicamente
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favoritos" }}
      />
      <Tab.Screen
        name="Profile"
        component={user ? ProfileScreen : LoginScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#8b5cf6",
    background: "#fdfaff",
    card: "#ffffff",
    text: "#333333",
    border: "#e2e8f0",
    notification: "#8b5cf6",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfaff",
  },
  header: {
    backgroundColor: "#8b5cf6",
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
  },
});

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar barStyle="light-content" backgroundColor="#8b5cf6" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: "white",
          headerTitleStyle: styles.headerTitle,
        }}
      >
        {!user ? (
          <React.Fragment>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                title: "Recuperar Senha",
                headerBackTitle: "Voltar",
              }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{
                title: "Redefinir Senha",
                headerBackTitle: "Voltar",
              }}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={({ route }) => ({
                title: "Detalhes do Produto",
                headerBackTitle: "Voltar",
              })}
            />
            <Stack.Screen
              name="AddProduct"
              component={AddProductScreen}
              options={({ route }) => ({
                title: route.params?.productId
                  ? "Editar Produto"
                  : "Adicionar Produto",
                headerBackTitle: "Cancelar",
              })}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{
                title: "Finalizar Compra",
                headerBackTitle: "Voltar",
              }}
            />
            <Stack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
              options={{
                title: "Compra Finalizada",
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{
                title: "Buscar Produtos",
                headerBackTitle: "Voltar",
              }}
            />
            <Stack.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{
                title: "Meus Favoritos",
                headerBackTitle: "Voltar",
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: "Meu Perfil",
                headerBackTitle: "Voltar",
              }}
            />
          </React.Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
