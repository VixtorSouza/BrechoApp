import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts, Product } from "../context/SimpleProductContext";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "../components/Toast";

type ProductDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

export default function ModernProductDetailScreen() {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute();
  const { productId } = (route.params as any) || {};
  const { getProductById, addToCart } = useProducts();
  const [product, setProduct] = useState(getProductById(productId));
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.tamanho || "");
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });
  const scrollViewRef = useRef<ScrollView>(null);

  // Usa as imagens do produto ou a imagem principal como fallback
  const productImages = React.useMemo(() => {
    console.log("=== PRODUCT IMAGES DEBUG ===");
    console.log("product:", product);

    if (!product) {
      console.log("Nenhum produto encontrado");
      return [];
    }

    console.log("product.imgSrc:", product.imgSrc);
    console.log("product.images:", product.images);

    // Se tem múltiplas imagens, usa todas
    if (product.images && product.images.length > 0) {
      console.log("Usando product.images:", product.images);
      return product.images;
    }

    // Se não, usa apenas a imagem principal (sem imagens falsas)
    const singleImage = [product.imgSrc];
    console.log("Usando imagem única:", singleImage);
    return singleImage;
  }, [product]);

  React.useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct);
      setLoading(false);
      if (foundProduct) {
        setSelectedSize(foundProduct.tamanho);
      }
    }
  }, [productId, getProductById]);

  // Forçar atualização dos indicadores quando selectedImageIndex muda
  React.useEffect(() => {
    // Debug removido - estado está funcionando
  }, [selectedImageIndex]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAddToCart = async () => {
    if (product && product.estoque > 0) {
      try {
        await addToCart(product, 1);
        setToast({
          visible: true,
          message: `${product.desc} adicionado ao carrinho!`,
          type: "success",
        });
      } catch (error) {
        setToast({
          visible: true,
          message: "Erro ao adicionar ao carrinho",
          type: "error",
        });
      }
    } else {
      setToast({
        visible: true,
        message: "Produto esgotado",
        type: "error",
      });
    }
  };

  const handleShare = async () => {
    if (product) {
      try {
        await Share.share({
          message: `Confira este produto: ${product.desc} por R$ ${formatPrice(
            product.valor
          )} no Brechó da Eliane!`,
          url: product.imgSrc,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    }
  };

  const handleFavorite = () => {
    // TODO: Implementar favoritos
    Alert.alert("Favoritos", "Funcionalidade de favoritos em desenvolvimento");
  };

  if (loading || !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  const hasDiscount = product.estoque > 5;
  const originalPrice = hasDiscount ? product.valor * 1.2 : product.valor;

  return (
    <View style={styles.container}>
      {/* Header moderno e-commerce */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Brechó da Eliane</Text>
          <View style={styles.headerRating}>
            <Ionicons name="star" size={12} color="#fbbf24" />
            <Text style={styles.ratingText}>4.8 (234)</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleFavorite}
          >
            <Ionicons name="heart-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de benefícios */}
      <View style={styles.benefitsBar}>
        <View style={styles.benefitItem}>
          <Ionicons name="shield-checkmark" size={14} color="#10b981" />
          <Text style={styles.benefitText}>Garantia</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="return-up-back" size={14} color="#10b981" />
          <Text style={styles.benefitText}>7 dias troca</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="rocket" size={14} color="#10b981" />
          <Text style={styles.benefitText}>Envio rápido</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Carrossel de imagens */}
        <View style={styles.imageCarousel}>
          <ScrollView
            horizontal
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={{ width: "100%" }}
            onMomentumScrollEnd={(event) => {
              const screenWidth = event.nativeEvent.layoutMeasurement.width;
              const index = Math.floor(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setSelectedImageIndex(index);
            }}
          >
            {productImages.map((image, index) => {
              console.log(`Renderizando imagem ${index}:`, image);
              return (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.mainImage}
                  onError={(error) => {
                    console.log(`Erro na imagem ${index}:`, error);
                    console.log(
                      `Tentando usar placeholder para imagem ${index}`
                    );
                  }}
                  onLoad={() =>
                    console.log(`Imagem ${index} carregada com sucesso`)
                  }
                  defaultSource={{
                    uri: "https://picsum.photos/400/400?random=" + index,
                  }}
                />
              );
            })}
          </ScrollView>

          {/* Indicadores do carrossel */}
          <View style={styles.carouselIndicators}>
            {productImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor:
                      index === selectedImageIndex ? "#8b5cf6" : "#d1d5db",
                  },
                ]}
              />
            ))}
          </View>

          {/* Badge de desconto */}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-20%</Text>
            </View>
          )}

          {/* Badge de estoque */}
          <View
            style={[
              styles.stockBadge,
              { backgroundColor: product.estoque > 0 ? "#10b981" : "#ef4444" },
            ]}
          >
            <Text style={styles.stockText}>
              {product.estoque > 0 ? `${product.estoque} unidades` : "Esgotado"}
            </Text>
          </View>
        </View>

        {/* Informações do produto */}
        <View style={styles.productInfo}>
          {/* Tipo e nome */}
          <Text style={styles.type}>{product.tipo}</Text>
          <Text style={styles.name}>{product.desc}</Text>

          {/* Preços */}
          <View style={styles.priceSection}>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                R$ {formatPrice(originalPrice)}
              </Text>
            )}
            <Text style={styles.currentPrice}>
              R$ {formatPrice(product.valor)}
            </Text>
            {hasDiscount && (
              <Text style={styles.discountInfo}>
                Economia de R$ {formatPrice(originalPrice - product.valor)}
              </Text>
            )}
          </View>

          {/* Descrição */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>
              Peça exclusiva do Brechó da Eliane, perfeita para compor seu look
              com estilo e sofisticação. Produto selecionado com cuidado para
              garantir qualidade e durabilidade.
            </Text>
          </View>

          {/* Tamanhos - Apenas o tamanho disponível */}
          <View style={styles.sizeSection}>
            <Text style={styles.sectionTitle}>Tamanho</Text>
            <View style={styles.singleSizeContainer}>
              <Text style={styles.singleSizeText}>{product.tamanho}</Text>
              <Text style={styles.singleSizeLabel}>
                Único tamanho disponível
              </Text>
            </View>
          </View>

          {/* Informações de retirada */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="storefront" size={20} color="#10b981" />
              <Text style={styles.infoText}>Retirada apenas no local</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark" size={20} color="#10b981" />
              <Text style={styles.infoText}>Garantia de 7 dias</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="return-up-back" size={20} color="#10b981" />
              <Text style={styles.infoText}>Troca grátis em até 7 dias</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom sheet com botão de compra */}
      <View style={styles.bottomSheet}>
        <TouchableOpacity
          style={[
            styles.buyButton,
            { backgroundColor: product.estoque > 0 ? "#8b5cf6" : "#9ca3af" },
          ]}
          onPress={handleAddToCart}
          disabled={product.estoque === 0}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.buyButtonText}>
            {product.estoque > 0 ? "Adicionar ao Carrinho" : "Produto Esgotado"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#8b5cf6",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 11,
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  benefitsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  benefitText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  imageCarousel: {
    height: 400,
    backgroundColor: "#f9fafb",
    position: "relative",
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mainImage: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
  },
  carouselIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stockBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  productInfo: {
    padding: 20,
  },
  type: {
    fontSize: 14,
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: "500",
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    lineHeight: 32,
  },
  priceSection: {
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 16,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  discountInfo: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  stars: {
    flexDirection: "row",
  },
  productRatingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sizeOptions: {
    flexDirection: "row",
    gap: 12,
  },
  sizeOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  singleSizeContainer: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  singleSizeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  singleSizeLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoSection: {
    marginBottom: 100, // Espaço para o bottom sheet
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#4b5563",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 20,
    paddingBottom: 30,
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
