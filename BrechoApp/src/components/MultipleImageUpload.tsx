import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

interface Props {
  value: string[];
  onImagesSelected: (images: string[]) => void;
  placeholder?: string;
  maxImages?: number;
}

export function MultipleImageUpload({
  value = [],
  onImagesSelected,
  placeholder = "Adicionar imagens",
  maxImages = 5,
}: Props) {
  const [images, setImages] = useState<string[]>(value);

  console.log("=== MULTIPLE IMAGE UPLOAD RENDER ===");
  console.log("value (props):", value);
  console.log("images (state):", images);
  console.log("maxImages:", maxImages);

  const addImage = async () => {
    console.log("=== ADD IMAGE START ===");

    if (images.length >= maxImages) {
      Alert.alert(
        "Limite de imagens",
        `Você pode adicionar no máximo ${maxImages} imagens`
      );
      return;
    }

    try {
      console.log("Solicitando permissão da galeria...");
      // Solicitar permissão para acessar a galeria
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Status da permissão:", status);

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à galeria para selecionar imagens"
        );
        return;
      }

      console.log("Abrindo seletor de imagens...");
      // Abrir o seletor de imagens
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log("Resultado do ImagePicker:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImageUri = result.assets[0].uri;
        console.log("Nova imagem URI:", newImageUri);
        const newImages = [...images, newImageUri];
        setImages(newImages);
        onImagesSelected(newImages);
        console.log("Imagem adicionada com sucesso!");
      } else {
        console.log("Usuário cancelou ou não selecionou imagem");
      }
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      Alert.alert("Erro", "Não foi possível adicionar a imagem");
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesSelected(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
    onImagesSelected(newImages);
  };

  const takePhoto = async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        "Limite de imagens",
        `Você pode adicionar no máximo ${maxImages} imagens`
      );
      return;
    }

    // Solicitar permissão para acessar a câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à câmera para tirar fotos"
      );
      return;
    }

    // Abrir a câmera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImageUri = result.assets[0].uri;
      const newImages = [...images, newImageUri];
      setImages(newImages);
      onImagesSelected(newImages);
    }
  };

  const showImageOptions = () => {
    console.log("=== SHOW IMAGE OPTIONS ===");
    // Temporariamente, vamos direto para a galeria
    console.log("Indo direto para a galeria (sem alert)...");
    addImage();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Imagens do Produto</Text>
      <Text style={styles.subtitle}>
        {images.length} de {maxImages} imagens
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Imagens existentes */}
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />

            {/* Ações da imagem */}
            <View style={styles.imageActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.moveLeftButton]}
                onPress={() => moveImage(index, Math.max(0, index - 1))}
                disabled={index === 0}
              >
                <Ionicons
                  name="chevron-back"
                  size={16}
                  color={index === 0 ? "#9ca3af" : "#fff"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.moveRightButton]}
                onPress={() =>
                  moveImage(index, Math.min(images.length - 1, index + 1))
                }
                disabled={index === images.length - 1}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={index === images.length - 1 ? "#9ca3af" : "#fff"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Indicador de ordem */}
            <View style={styles.orderIndicator}>
              <Text style={styles.orderText}>{index + 1}</Text>
            </View>
          </View>
        ))}

        {/* Botão adicionar imagem */}
        {images.length < maxImages && (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={showImageOptions}
          >
            <Ionicons name="add" size={32} color="#9ca3af" />
            <Text style={styles.addImageText}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={styles.hint}>
        • A primeira imagem será a capa do produto • Arraste as imagens para
        reordenar • Clique nos botões para mover ou excluir
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  scrollContainer: {
    maxHeight: 140,
  },
  scrollContent: {
    gap: 12,
    paddingHorizontal: 2,
  },
  imageContainer: {
    position: "relative",
    width: 120,
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  imageActions: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 4,
    padding: 2,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  moveLeftButton: {
    backgroundColor: "#8b5cf6",
  },
  moveRightButton: {
    backgroundColor: "#8b5cf6",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  orderIndicator: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "#8b5cf6",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  orderText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  addImageText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    lineHeight: 16,
  },
});
