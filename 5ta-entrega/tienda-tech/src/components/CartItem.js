import { View, Text, Button } from "react-native";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity } = useCart();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
      }}
    >
      <View>
        <Text style={{ fontSize: 16 }}>{item.nombre}</Text>
        <Text>${item.precio}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Button title="-" onPress={() => decreaseQuantity(item.id)} />
        <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
        <Button title="+" onPress={() => increaseQuantity(item.id)} />
      </View>
    </View>
  );
}
