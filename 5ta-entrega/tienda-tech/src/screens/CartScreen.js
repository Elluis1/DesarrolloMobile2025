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
} from "react-native";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import CartItem from "../components/CartItem";

export default function CartScreen() {
  const { cartItems, getTotal, clearCart, createOrder } = useCart();
  const { user } = useContext(AuthContext);

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
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
        ]}
      >
        <Text style={styles.title}>Carrito</Text>

        {cartItems.length === 0 ? (
          <Text style={styles.empty}>Tu carrito está vacío</Text>
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CartItem item={item} />}
              contentContainerStyle={{ paddingBottom: 20 }}
            />

            <Text style={styles.total}>Total: ${getTotal()}</Text>

            <View style={styles.buttonsContainer}>
              <View style={styles.buttonWrapper}>
                <Button title="Vaciar carrito" onPress={clearCart} />
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Hacer pedido"
                  onPress={handleCreateOrder}
                  disabled={!user} // deshabilitado si no hay usuario
                />
              </View>
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  empty: {
    fontSize: 18,
    color: "gray",
    marginTop: 40,
    textAlign: "center",
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  buttonWrapper: {
    marginVertical: 5,
  },
});
