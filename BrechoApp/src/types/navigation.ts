import { Product } from "./models.js";
import { NavigatorScreenParams } from "@react-navigation/native";

// Tipos para as rotas das abas
export type TabParamList = {
  Catalog: undefined;
  Search: undefined;
  Cart: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };

  // Main Tabs
  MainTabs: NavigatorScreenParams<TabParamList>;

  // Product
  ProductDetail: { productId: string };
  AddProduct: { productId?: string } | undefined;

  // Cart
  Checkout: undefined;
  OrderConfirmation: { orderId: string };

  // Search
  Search: undefined;

  // Favorites
  Favorites: undefined;

  // User
  Profile: undefined;
};
