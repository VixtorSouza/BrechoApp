import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onHide?: () => void;
}

export function Toast({
  visible,
  message,
  type = "success",
  onHide,
}: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide?.();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, onHide]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      default:
        return "information-circle";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor(), opacity: fadeAnim },
      ]}
    >
      <Ionicons name={getIcon()} size={20} color="#fff" />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  message: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});
