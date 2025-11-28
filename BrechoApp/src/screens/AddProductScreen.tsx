import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useProducts } from "../context/ProductContext";
import * as ImagePicker from "expo-image-picker";

type AddProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddProduct"
>;
type AddProductRouteProp = RouteProp<RootStackParamList, "AddProduct">;

export default function AddProductScreen() {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const route = useRoute<AddProductRouteProp>();
  const { addProduct, updateProduct, getProductById } = useProducts();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("Usado");
  const [estoque, setEstoque] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [imagem, setImagem] = useState("");
  const [loading, setLoading] = useState(false);

  // Se estiver editando, carrega os dados do produto
  React.useEffect(() => {
    if (route.params?.productId) {
      const product = getProductById(route.params.productId);
      if (product) {
        setDescricao(product.desc);
        setValor(product.valor.toString());
        setTipo(product.tipo);
        setEstoque(product.estoque.toString());
        setTamanho(product.tamanho);
        setImagem(product.imgSrc);
      }
    }
  }, [route.params?.productId, getProductById]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
    }
  };

  const handleSubmit = async () => {
    if (!descricao || !valor || !tipo || !estoque || !tamanho) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    const productData = {
      desc: descricao,
      valor: parseFloat(valor),
      tipo,
      estoque: parseInt(estoque, 10),
      tamanho,
      imgSrc: imagem || "https://via.placeholder.com/150",
    };

    try {
      setLoading(true);

      if (route.params?.productId) {
        await updateProduct(route.params.productId, productData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        await addProduct(productData);
        Alert.alert("Sucesso", "Produto adicionado com sucesso!");
      }

      navigation.goBack();
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição*</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Ex: Camiseta branca"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor (R$)*</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            placeholder="Ex: 29.90"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo*</Text>
          <View style={styles.radioGroup}>
            <Button
              title="Usado"
              onPress={() => setTipo("Usado")}
              color={tipo === "Usado" ? "#8b5cf6" : "#ccc"}
            />
            <Button
              title="Novo"
              onPress={() => setTipo("Novo")}
              color={tipo === "Novo" ? "#8b5cf6" : "#ccc"}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Estoque*</Text>
          <TextInput
            style={styles.input}
            value={estoque}
            onChangeText={setEstoque}
            placeholder="Quantidade em estoque"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tamanho*</Text>
          <TextInput
            style={styles.input}
            value={tamanho}
            onChangeText={setTamanho}
            placeholder="Ex: P, M, G, GG"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Imagem</Text>
          <Button title="Selecionar Imagem" onPress={pickImage} />
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.imagePreview} />
          ) : null}
        </View>

        {/* Espaço extra para garantir que o conteúdo não fique atrás do botão fixo */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão fixo na parte inferior */}
      <View style={styles.fixedButtonContainer}>
        <Button
          title={
            route.params?.productId ? "Atualizar Produto" : "Adicionar Produto"
          }
          onPress={handleSubmit}
          color="#8b5cf6"
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Espaço extra para o botão fixo
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    resizeMode: "contain",
    borderRadius: 8,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 4,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});
