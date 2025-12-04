// LogoutScreen.js
import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function LogoutScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { clearCart } = useCart();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      clearCart();
      navigation.navigate("Home"); // o "Login"
    };
    doLogout();
  }, []);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
      <Text>Cerrando sesión...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
