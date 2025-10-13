import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTxnEvents } from "../hooks/useTxnEvents";

const USER_ID = "user_123";

export default function LiveEventsScreen() {
  const events = useTxnEvents(USER_ID);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos en Vivo</Text>

      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.event}>
            <Text style={styles.type}>{item.type}</Text>
            <Text>{JSON.stringify(item.payload)}</Text>
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
