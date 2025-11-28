import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts, Product } from "../context/SimpleProductContext";
import ImageUpload from "../components/ImageUpload";

export default function StockScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { products, updateProduct, removeProduct, addProduct } = useProducts();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [formData, setFormData] = useState({
    desc: "",
    valor: "",
    tipo: "",
    estoque: "",
    tamanho: "",
    imgSrc: "",
  });

  // Força atualização quando products mudar
  useEffect(() => {
    console.log("Products atualizados:", products.length);
    console.log(
      "Products IDs:",
      products.map((p) => p.id)
    );
    setForceUpdate((prev) => prev + 1);
  }, [products]);

  // Log inicial
  console.log("=== StockScreen renderizado ===");
  console.log("Products atuais:", products.length);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        desc: product.desc,
        valor: product.valor.toString(),
        tipo: product.tipo,
        estoque: product.estoque.toString(),
        tamanho: product.tamanho,
        imgSrc: product.imgSrc,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        desc: "",
        valor: "",
        tipo: "",
        estoque: "",
        tamanho: "",
        imgSrc: "",
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProduct(null);
    setFormData({
      desc: "",
      valor: "",
      tipo: "",
      estoque: "",
      tamanho: "",
      imgSrc: "",
    });
  };

  const handleSave = async () => {
    const errors = [];

    if (!formData.desc.trim()) {
      errors.push("Descrição é obrigatória");
    }

    if (!formData.valor.trim()) {
      errors.push("Preço é obrigatório");
    } else {
      // Remove tudo exceto números e ponto/vírgula
      const cleanValor = formData.valor.replace(/[^\d.,-]/g, "");

      // Converte vírgula para ponto para padronização
      const valorPadronizado = cleanValor.replace(",", ".");
      const valorNumerico = parseFloat(valorPadronizado);

      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        errors.push(
          "Preço deve ser um número maior que 0 (ex: 10.50 ou 1000000)"
        );
      } else if (valorNumerico > 999999999.99) {
        errors.push("Preço muito alto. Use um valor menor que 1.000.000.000");
      }
    }

    if (!formData.tipo.trim()) {
      errors.push("Tipo é obrigatório");
    }

    if (!formData.estoque.trim()) {
      errors.push("Estoque é obrigatório");
    } else if (
      isNaN(parseInt(formData.estoque)) ||
      parseInt(formData.estoque) < 0
    ) {
      errors.push(
        "Estoque deve ser um número inteiro maior ou igual a 0 (ex: 5)"
      );
    }

    if (!formData.tamanho.trim()) {
      errors.push("Tamanho é obrigatório");
    }

    if (errors.length > 0) {
      Alert.alert("Erro de Validação", errors.join("\n"));
      return;
    }

    setLoading(true);
    try {
      // Converte o valor de forma segura
      const cleanValor = formData.valor.replace(/[^\d.,-]/g, "");
      const valorPadronizado = cleanValor.replace(",", ".");
      const valorNumerico = parseFloat(valorPadronizado);

      const productData = {
        desc: formData.desc.trim(),
        valor: valorNumerico,
        tipo: formData.tipo.trim(),
        estoque: parseInt(formData.estoque),
        tamanho: formData.tamanho.trim(),
        imgSrc:
          formData.imgSrc ||
          `https://picsum.photos/200/200?random=${Date.now()}`,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso");
      } else {
        await addProduct(productData);
        Alert.alert("Sucesso", "Produto adicionado com sucesso");
      }

      closeModal();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o produto. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (product: Product) => {
    console.log(
      "Iniciando exclusão do produto:",
      product.desc,
      "ID:",
      product.id
    );

    console.log("=== TESTE DIRETO SEM ALERT ===");
    console.log("Chamando removeProduct diretamente...");

    removeProduct(product.id)
      .then(() => {
        console.log("=== EXCLUSÃO DIRETA BEM SUCEDIDA ===");
        Alert.alert("Sucesso", "Produto excluído com sucesso");
        setForceUpdate((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("=== ERRO NA EXCLUSÃO DIRETA ===", error);
        Alert.alert("Erro", "Não foi possível excluir o produto");
      });
  };

  const formatPrice = (price: number): string => {
    // Converte para string e remove notação científica
    const priceStr = price.toString();

    // Se já estiver em notação científica, converte para decimal
    if (priceStr.includes("e")) {
      return price.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    // Para números normais, usa toLocaleString para formatação segura
    return price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.desc}</Text>
        <Text style={styles.productDetails}>
          Tipo: {item.tipo} | Tamanho: {item.tamanho}
        </Text>
        <Text style={styles.productPrice}>R$ {formatPrice(item.valor)}</Text>
        <Text
          style={[
            styles.stockStatus,
            { color: item.estoque > 0 ? "#4CAF50" : "#f44336" },
          ]}
        >
          Estoque: {item.estoque} {item.estoque > 0 ? "disponível" : "esgotado"}
        </Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openModal(item)}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Estoque</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingBottom: 20 }}
        extraData={forceUpdate}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingProduct ? "Editar Produto" : "Adicionar Produto"}
              </Text>

              <View style={styles.imageContainer}>
                <ImageUpload
                  value={formData.imgSrc}
                  onImageSelected={(uri) =>
                    setFormData({ ...formData, imgSrc: uri })
                  }
                  placeholder="Imagem do produto"
                  size={120}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Descrição do produto"
                value={formData.desc}
                onChangeText={(text) =>
                  setFormData({ ...formData, desc: text })
                }
              />

              <TextInput
                style={styles.input}
                placeholder="Preço (ex: 10.50 ou 1000000)"
                value={formData.valor}
                onChangeText={(text) =>
                  setFormData({ ...formData, valor: text })
                }
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Tipo (Vestido, Blusa, Calça, etc.)"
                value={formData.tipo}
                onChangeText={(text) =>
                  setFormData({ ...formData, tipo: text })
                }
              />

              <TextInput
                style={styles.input}
                placeholder="Estoque"
                value={formData.estoque}
                onChangeText={(text) =>
                  setFormData({ ...formData, estoque: text })
                }
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Tamanho (P, M, G, etc.)"
                value={formData.tamanho}
                onChangeText={(text) =>
                  setFormData({ ...formData, tamanho: text })
                }
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Cancelar"
                  onPress={closeModal}
                  color="#666"
                  disabled={loading}
                />
                <Button
                  title={
                    loading
                      ? "Salvando..."
                      : editingProduct
                      ? "Atualizar"
                      : "Adicionar"
                  }
                  onPress={handleSave}
                  color="#8b5cf6"
                  disabled={loading}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#8b5cf6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "#8b5cf6",
    fontWeight: "bold",
  },
  productCard: {
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
  productInfo: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "bold",
    marginBottom: 5,
  },
  stockStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  productActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10, // Adiciona espaço entre os botões
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 60, // Garante largura mínima
    alignItems: "center",
    zIndex: 1, // Garante que fique acima de outros elementos
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    width: "90%",
    maxHeight: "90%",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
