import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useCart } from "../context/CartContext";
import { API_URL } from "../api/auth";

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity } = useCart();

  const baseUrl = API_URL.replace("/api", "");

  const imageUrl =
    item.imagenes && item.imagenes.length > 0
      ? `${baseUrl}${
          item.imagenes[0].formats?.small?.url ||
          item.imagenes[0].url
        }`
      : null;

  return (
    <View style={styles.card}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.nombre}
        </Text>

        <Text style={styles.price}>
          AR$ {item.precio}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => decreaseQuantity(item.id)}
          >
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => increaseQuantity(item.id)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },

  info: {
    flex: 1,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 6,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyButton: {
    backgroundColor: "#111",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
  },
});
