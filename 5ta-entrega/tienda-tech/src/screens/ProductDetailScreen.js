import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { toggleFavorite } from "../api/favorites";

export default function ProductDetailScreen({ route, navigation }) {
  const { product, favorites: initialFavorites, reloadFavorites } = route.params;
  const { user } = useContext(AuthContext);

  const [favorites, setFavorites] = useState(initialFavorites || []);
  const [isFavorite, setIsFavorite] = useState(
    initialFavorites?.includes(product?.id) || false
  );
  
  const handleFav = async () => {
    if (!user || !product) return;
  
    try {
      const result = await toggleFavorite(user.id, product.id);
  
      // Cambiamos directamente el estado local para reflejar el color
      setIsFavorite(result.added);
  
      // Actualizamos favoritos globales si hace falta
      reloadFavorites && reloadFavorites();
    } catch (err) {
      console.log("❌ Error al cambiar favorito:", err);
    }
  };
  

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Producto no disponible 😢</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container}>
        {product.images && product.images.length > 0 && (
          <Image
            source={{ uri: product.images[0].url }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <Text style={styles.title}>{product.nombre}</Text>
        <Text style={styles.price}>💵 AR$ {product.precio}</Text>

        {product.descuento && (
          <Text style={styles.discount}>Descuento: {product.descuento}%</Text>
        )}

        <Text style={styles.description}>
          {product.descripcion?.[0]?.children?.[0]?.text}
        </Text>

        <Text style={styles.stock}>Stock: {product.stock}</Text>

        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favActive]}
          onPress={handleFav}
        >
          <Text style={styles.favText}>
            {isFavorite ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },
  image: { width: "100%", height: 300, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  discount: { fontSize: 16, color: "red", marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 8 },
  stock: { fontSize: 16, marginBottom: 16 },
  favButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  favActive: { backgroundColor: "#ffcccc" },
  favText: { fontWeight: "600", fontSize: 16 },
});
