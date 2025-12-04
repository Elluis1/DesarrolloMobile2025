import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useCart } from "../context/CartContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function FakePaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { total } = route.params;
  const { createOrder, clearCart } = useCart();
  const { user } = useContext(AuthContext);

  const [card, setCard] = useState("");

  const handlePayment = async () => {
    if (card !== "1111") {
      alert("❌ Pago rechazado. Usa la tarjeta 1111");
      return;
    }

    try {
      await createOrder(user.id);
      clearCart();
      alert("✅ Pago acreditado - Pedido creado con éxito!");
      navigation.navigate("Home");
    } catch (err) {
      alert("❌ Error al crear pedido.");
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulación de Pago</Text>
      <Text style={styles.subtitle}>Total a pagar: ${total}</Text>

      <TextInput
        style={styles.input}
        placeholder="Número de tarjeta (usar 1111)"
        value={card}
        onChangeText={setCard}
      />

      <Button title="Pagar" onPress={handlePayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
});
