import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
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

// Screens
import CatalogScreen from "../screens/CatalogScreen";
import SimpleCartScreen from "../screens/SimpleCartScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import SimpleAddProductScreen from "../screens/SimpleAddProductScreen";
import SimpleStockScreen from "../screens/SimpleStockScreen";
import SimpleCheckoutScreen from "../screens/SimpleCheckoutScreen";
import SimpleOrderConfirmationScreen from "../screens/SimpleOrderConfirmationScreen";
import SimpleSearchScreen from "../screens/SimpleSearchScreen";
import SimpleFavoritesScreen from "../screens/SimpleFavoritesScreen";

// Types
export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { productId: string };
  AddProduct: { productId?: string };
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  Search: undefined;
  Favorites: undefined;
};

type TabParamList = {
  Catalog: undefined;
  Search: undefined;
  Cart: undefined;
  Favorites: undefined;
  Stock: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
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
            case "Stock":
              iconName = focused ? "list" : "list-outline";
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
        component={SimpleSearchScreen}
        options={{ title: "Buscar" }}
      />
      <Tab.Screen
        name="Cart"
        component={SimpleCartScreen}
        options={{ title: "Carrinho" }}
      />
      <Tab.Screen
        name="Favorites"
        component={SimpleFavoritesScreen}
        options={{ title: "Favoritos" }}
      />
      <Tab.Screen
        name="Stock"
        component={SimpleStockScreen}
        options={{ title: "Estoque" }}
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

export default function SimpleAppNavigator() {
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
          component={SimpleAddProductScreen}
          options={({ route }) => ({
            title: route.params?.productId
              ? "Editar Produto"
              : "Adicionar Produto",
            headerBackTitle: "Cancelar",
          })}
        />
        <Stack.Screen
          name="Checkout"
          component={SimpleCheckoutScreen}
          options={{
            title: "Finalizar Compra",
            headerBackTitle: "Voltar",
          }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={SimpleOrderConfirmationScreen}
          options={{
            title: "Compra Finalizada",
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Search"
          component={SimpleSearchScreen}
          options={{
            title: "Buscar Produtos",
            headerBackTitle: "Voltar",
          }}
        />
        <Stack.Screen
          name="Favorites"
          component={SimpleFavoritesScreen}
          options={{
            title: "Meus Favoritos",
            headerBackTitle: "Voltar",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
