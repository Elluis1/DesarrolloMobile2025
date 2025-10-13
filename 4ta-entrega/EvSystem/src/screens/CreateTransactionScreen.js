import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createTransaction } from "../services/api";

const USER_ID = "user_123";

export default function CreateTransactionScreen() {
  const [amount, setAmount] = useState("");

  const handleCreate = async () => {
    if (!amount) return Alert.alert("Error", "Ingrese un monto");
    try {
      await createTransaction({
        fromAccount: "Cuenta_A",
        toAccount: "Cuenta_B",
        amount: Number(amount),
        currency: "USD",
        userId: USER_ID,
      });
      Alert.alert("✅ Éxito", "Transacción enviada");
      setAmount("");
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "No se pudo enviar la transacción");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Transacción</Text>

      <TextInput
        style={styles.input}
        placeholder="Monto (USD)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Button title="Enviar" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, marginBottom: 15, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});
