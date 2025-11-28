import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProductProvider } from "../src/context/ProductContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ProductProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Login" }} />
          <Stack.Screen name="catalog" options={{ title: "Catálogo" }} />
          <Stack.Screen name="cart" options={{ title: "Carrinho" }} />
          <Stack.Screen name="details/[id]" options={{ title: "Detalhes" }} />
        </Stack>
      </ProductProvider>
    </SafeAreaProvider>
  );
}
