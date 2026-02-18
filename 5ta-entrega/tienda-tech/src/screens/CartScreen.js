import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import CartItem from "../components/CartItem";
import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  const { cartItems, getTotal, clearCart, createOrder } = useCart();
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleCreateOrder = async () => {
    if (!user) {
      alert("Debes iniciar sesión para hacer un pedido.");
      return;
    }

    try {
      const order = await createOrder(user.id);
      alert("Pedido creado con éxito!");
    } catch (err) {
      console.log("❌ Error creando pedido:", err);
      alert("Error creando pedido.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>🛒 Mi Carrito</Text>

        {cartItems.length === 0 ? (
          <Text style={styles.empty}>Tu carrito está vacío</Text>
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CartItem item={item} />}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            />

            {/* FOOTER FIJO */}
            <View style={styles.checkoutContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>AR$ {getTotal()}</Text>
              </View>

              <TouchableOpacity
                style={styles.payButton}
                onPress={() =>
                  navigation.navigate("FakePayment", {
                    total: getTotal(),
                  })
                }
                disabled={!user}
              >
                <Text style={styles.payText}>Ir a pagar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
                <Text style={styles.clearText}>Vaciar carrito</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },

  empty: {
    fontSize: 18,
    color: "gray",
    marginTop: 60,
    textAlign: "center",
  },

  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  totalLabel: {
    fontSize: 18,
    color: "#666",
  },

  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
  },

  payButton: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  clearButton: {
    alignItems: "center",
  },

  clearText: {
    color: "red",
    fontWeight: "600",
  },
});
