import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useProducts } from "../context/SimpleProductContext";

export default function AddProductScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { productId } = (route.params as any) || {};
  const { addProduct, updateProduct, getProductById } = useProducts();

  const [formData, setFormData] = useState({
    desc: "",
    valor: "",
    tipo: "",
    estoque: "",
    tamanho: "",
    imgSrc: "",
  });

  const [loading, setLoading] = useState(false);

  // Se estiver editando, carrega os dados do produto
  React.useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        setFormData({
          desc: product.desc,
          valor: product.valor.toString(),
          tipo: product.tipo,
          estoque: product.estoque.toString(),
          tamanho: product.tamanho,
          imgSrc: product.imgSrc,
        });
      }
    }
  }, [productId, getProductById]);

  const handleSave = async () => {
    if (
      !formData.desc ||
      !formData.valor ||
      !formData.tipo ||
      !formData.estoque ||
      !formData.tamanho
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        desc: formData.desc,
        valor: parseFloat(formData.valor),
        tipo: formData.tipo,
        estoque: parseInt(formData.estoque),
        tamanho: formData.tamanho,
        imgSrc:
          formData.imgSrc ||
          `https://picsum.photos/200/200?random=${Date.now()}`,
      };

      if (productId) {
        await updateProduct(productId, productData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso");
      } else {
        await addProduct(productData);
        Alert.alert("Sucesso", "Produto adicionado com sucesso");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {productId ? "Editar Produto" : "Adicionar Produto"}
      </Text>

      <ScrollView style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Vestido Floral Elegante"
            value={formData.desc}
            onChangeText={(text) => setFormData({ ...formData, desc: text })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Preço (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 89.90"
            value={formData.valor}
            onChangeText={(text) => setFormData({ ...formData, valor: text })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tipo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Vestido, Blusa, Calça"
            value={formData.tipo}
            onChangeText={(text) => setFormData({ ...formData, tipo: text })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Estoque *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 10"
            value={formData.estoque}
            onChangeText={(text) => setFormData({ ...formData, estoque: text })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tamanho *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: P, M, G"
            value={formData.tamanho}
            onChangeText={(text) => setFormData({ ...formData, tamanho: text })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>URL da Imagem (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Deixe em branco para usar imagem aleatória"
            value={formData.imgSrc}
            onChangeText={(text) => setFormData({ ...formData, imgSrc: text })}
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Salvando..." : productId ? "Atualizar" : "Adicionar"}
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
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actions: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#8b5cf6",
  },
  saveButton: {
    backgroundColor: "#8b5cf6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
