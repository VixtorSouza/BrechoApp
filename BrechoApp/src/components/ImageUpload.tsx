import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import condicional do ImagePicker
let ImagePicker: any = null;
try {
  ImagePicker = require("expo-image-picker");
} catch (error) {
  console.log("expo-image-picker não disponível, usando modo fallback");
}

interface ImageUploadProps {
  value?: string;
  onImageSelected: (uri: string) => void;
  placeholder?: string;
  size?: number;
}

export default function ImageUpload({
  value,
  onImageSelected,
  placeholder = "Adicionar imagem",
  size = 100,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const isWeb = Platform.OS === "web";
  const isMobile = !isWeb;

  // Função para upload via input de arquivo (web)
  const handleFileInput = () => {
    if (!isWeb) return;

    try {
      // Acessar o window de forma segura usando globalThis
      const globalWindow =
        typeof globalThis !== "undefined" && (globalThis as any).window;

      if (!globalWindow || !globalWindow.document) {
        Alert.alert("Erro", "Função não disponível neste ambiente");
        return;
      }

      const input = globalWindow.document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = (event: any) => {
        const file = event.target?.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const result = e.target?.result as string;
            onImageSelected(result);
          };
          reader.readAsDataURL(file);
        }
      };

      input.click();
    } catch (error) {
      console.error("Erro ao abrir input de arquivo:", error);
      Alert.alert("Erro", "Não foi possível abrir o seletor de arquivos");
    }
  };

  // Função para usar imagem placeholder
  const usePlaceholderImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const placeholderUrl = `https://picsum.photos/200/200?random=${randomId}`;
    onImageSelected(placeholderUrl);
  };

  const requestPermissions = async () => {
    if (!ImagePicker) {
      Alert.alert(
        "Erro",
        "ImagePicker não está disponível. Use a opção de URL."
      );
      return false;
    }

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à galeria para selecionar imagens."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissões da galeria:", error);
      Alert.alert("Erro", "Não foi possível solicitar permissões da galeria.");
      return false;
    }
  };

  const pickImage = async () => {
    if (!ImagePicker) {
      Alert.alert(
        "Erro",
        "ImagePicker não está disponível. Use a opção de URL."
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        onImageSelected(uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    if (!ImagePicker) {
      Alert.alert(
        "Erro",
        "ImagePicker não está disponível. Use a opção de URL."
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à câmera para tirar fotos."
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        onImageSelected(uri);
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    console.log("showImageOptions chamado");

    if (isWeb) {
      // No web, usa modal customizado
      setShowOptions(true);
    } else {
      // No mobile, usa Alert nativo
      const options: any[] = [
        {
          text: "Usar URL da Imagem",
          onPress: () => {
            console.log("Opção URL selecionada");
            setShowUrlInput(true);
          },
        },
        {
          text: "Imagem Aleatória",
          onPress: () => {
            console.log("Opção Imagem Aleatória selecionada");
            usePlaceholderImage();
          },
        },
      ];

      // Adicionar opções de ImagePicker apenas se estiver disponível
      if (ImagePicker) {
        options.unshift(
          {
            text: "Tirar Foto",
            onPress: () => {
              console.log("Opção Tirar Foto selecionada");
              takePhoto();
            },
          },
          {
            text: "Galeria",
            onPress: () => {
              console.log("Opção Galeria selecionada");
              pickImage();
            },
          }
        );
      }

      options.push({
        text: "Cancelar",
        style: "cancel" as const,
      });

      console.log("Mostrando Alert com", options.length, "opções");
      Alert.alert(
        "Adicionar Imagem",
        "Escolha como deseja adicionar a imagem",
        options
      );
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelected(imageUrl.trim());
      setImageUrl("");
      setShowUrlInput(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.uploadButton, { width: size, height: size }]}
        onPress={showImageOptions}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#8b5cf6" />
          </View>
        ) : value ? (
          <Image
            source={{ uri: value }}
            style={[styles.image, { width: size, height: size }]}
          />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size }]}>
            <Ionicons name="camera-outline" size={size * 0.3} color="#ccc" />
          </View>
        )}
      </TouchableOpacity>

      {!value && !loading && (
        <Text style={styles.placeholderText}>{placeholder}</Text>
      )}

      {showUrlInput && (
        <View style={styles.urlInputContainer}>
          <TextInput
            style={styles.urlInput}
            placeholder="Digite a URL da imagem"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoFocus
            onSubmitEditing={handleUrlSubmit}
          />
          <View style={styles.urlInputButtons}>
            <TouchableOpacity
              style={styles.urlButton}
              onPress={handleUrlSubmit}
            >
              <Text style={styles.urlButtonText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.urlButton, styles.cancelButton]}
              onPress={() => {
                setShowUrlInput(false);
                setImageUrl("");
              }}
            >
              <Text style={styles.urlButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {value && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onImageSelected("")}
        >
          <Ionicons name="trash-outline" size={16} color="#ff4444" />
          <Text style={styles.removeText}>Remover</Text>
        </TouchableOpacity>
      )}

      {/* Modal customizado para web */}
      {showOptions && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Imagem</Text>
            <Text style={styles.modalSubtitle}>
              Escolha como deseja adicionar a imagem
            </Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                console.log("Opção Escolher Arquivo selecionada");
                handleFileInput();
                setShowOptions(false);
              }}
            >
              <Ionicons name="folder-outline" size={20} color="#8b5cf6" />
              <Text style={styles.optionText}>Escolher Arquivo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                console.log("Opção URL selecionada");
                setShowUrlInput(true);
                setShowOptions(false);
              }}
            >
              <Ionicons name="link-outline" size={20} color="#8b5cf6" />
              <Text style={styles.optionText}>Usar URL da Imagem</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                console.log("Opção Imagem Aleatória selecionada");
                usePlaceholderImage();
                setShowOptions(false);
              }}
            >
              <Ionicons name="shuffle-outline" size={20} color="#8b5cf6" />
              <Text style={styles.optionText}>Imagem Aleatória</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.cancelOptionButton]}
              onPress={() => setShowOptions(false)}
            >
              <Ionicons name="close-outline" size={20} color="#666" />
              <Text style={[styles.optionText, styles.cancelOptionText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  uploadButton: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f8f8",
  },
  image: {
    borderRadius: 6,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    padding: 5,
  },
  removeText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#ff4444",
  },
  urlInputContainer: {
    marginTop: 10,
    width: "100%",
    maxWidth: 200,
  },
  urlInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    fontSize: 12,
    marginBottom: 5,
  },
  urlInputButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  urlButton: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    padding: 6,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 2,
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  urlButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Estilos do modal
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    minWidth: 250,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  cancelOptionButton: {
    backgroundColor: "#e9ecef",
  },
  cancelOptionText: {
    color: "#666",
  },
});
