import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [fontFamily, setFontFamily] = useState<"sans-serif" | "serif">("sans-serif");

  // estilos dinámicos según tema + fuente
  const styles = getStyles(darkMode, fontFamily);

  const handleIncrement = () => {
    if (count >= 10) {
      Alert.alert("Aviso", "El contador no puede superar 10");
      return;
    }
    setCount((prev) => prev + 1);
  };

  const handleReset = () => setCount(0);

  const handleToggle = () => {
    setDarkMode((prev) => !prev);
    setFontFamily((prev) => (prev === "sans-serif" ? "serif" : "sans-serif"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.count}>{count}</Text>

        <View style={styles.buttonsRow}>
          <Pressable style={styles.button} onPress={handleIncrement}>
            <Text style={styles.buttonText}>+1</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleToggle}>
            <Text style={styles.buttonText}>Toggle</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// función para estilos dinámicos
const getStyles = (darkMode: boolean, fontFamily: "sans-serif" | "serif") =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: darkMode ? "#121212" : "#f2f2f2",
    },
    card: {
      width: "80%",
      padding: 20,
      borderRadius: 16,
      backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    count: {
      fontSize: 64,
      textAlign: "center",
      color: darkMode ? "#ffffff" : "#000000",
      marginBottom: 20,
      fontFamily, // 👈 fuente dinámica
    },
    buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: darkMode ? "#333333" : "#007bff",
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
      fontFamily, // 👈 también aplicamos fuente a los botones
    },
  });

