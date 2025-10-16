import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTxnEvents } from "../hooks/useTxnEvents";

const USER_ID = "user_123";

export default function LiveEventsScreen() {
  const events = useTxnEvents(USER_ID);
  console.log("Eventos actuales:", events);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos en Vivo</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.transactionId + item.type}
        renderItem={({ item }) => (
          <View style={styles.event}>
            <Text style={styles.type}>{item.type}</Text>
            {item.payload.amount !== undefined && (
              <Text>Monto: {item.payload.amount}</Text>
            )}
            {item.payload.holdId && <Text>Hold ID: {item.payload.holdId}</Text>}
            {item.payload.ledgerTxId && (
              <Text>Ledger TX: {item.payload.ledgerTxId}</Text>
            )}
            {item.payload.risk && <Text>Riesgo: {item.payload.risk}</Text>}
            {item.payload.channels && (
              <Text>Canales: {item.payload.channels.join(", ")}</Text>
            )}
            {item.payload.userId && <Text>Usuario: {item.payload.userId}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  event: { borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
  type: { fontWeight: "bold" },
});
