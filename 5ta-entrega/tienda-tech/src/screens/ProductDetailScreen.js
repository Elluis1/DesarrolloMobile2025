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
import { useCart } from "../context/CartContext";
import { API_URL } from "../api/auth";

export default function ProductDetailScreen({ route, navigation }) {
  const {
    product,
    favorites: initialFavorites,
    reloadFavorites,
  } = route.params;
  const { user } = useContext(AuthContext);

  const [favorites, setFavorites] = useState(initialFavorites || []);
  const isFavorite = favorites.includes(product.id);

  const baseUrl = API_URL.replace("/api", "");

  const imageUrl =
    product.imagenes && product.imagenes.length > 0
      ? `${baseUrl}${
          product.imagenes[0].formats?.small?.url || product.imagenes[0].url
        }`
      : null;

  const handleFav = async () => {
    if (!user || !product) return;

    const alreadyFav = favorites.includes(product.id);

    // UI instantánea (optimistic update)
    if (alreadyFav) {
      setFavorites((prev) => prev.filter((id) => id !== product.id));
    } else {
      setFavorites((prev) => [...prev, product.id]);
    }

    try {
      await toggleFavorite(user.id, product.id);
      reloadFavorites && reloadFavorites();
    } catch (err) {
      console.log("❌ Error al cambiar favorito:", err);
    }
  };

  const { addToCart } = useCart();

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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={{ color: "#999" }}>Sin imagen</Text>
            </View>
          )}

          {typeof product.descuento === "number" && product.descuento > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.descuento}%</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{product.nombre}</Text>

          <Text style={styles.price}>
            💵 AR$ {product.precio.toLocaleString()}
          </Text>

          <Text style={styles.description}>
            {product.descripcion?.[0]?.children?.[0]?.text ||
              "Sin descripción disponible"}
          </Text>

          <Text
            style={[
              styles.stock,
              product.stock > 0 ? styles.inStock : styles.outStock,
            ]}
          >
            {product.stock > 0 ? `En stock (${product.stock})` : "Sin stock"}
          </Text>

          {/* Botón favoritos */}
          <TouchableOpacity
            style={[styles.favButton, isFavorite && styles.favActive]}
            onPress={handleFav}
          >
            <Text style={styles.favText}>
              {isFavorite ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
            </Text>
          </TouchableOpacity>

          {/* Botón carrito */}
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => addToCart(product)}
          >
            <Text style={styles.cartText}>🛒 Añadir al carrito</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 320,
  },

  placeholder: {
    width: "100%",
    height: 320,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  discountBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#ff3b30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  discountText: {
    color: "#fff",
    fontWeight: "bold",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111",
  },

  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    lineHeight: 22,
  },

  stock: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },

  inStock: {
    color: "#27ae60",
  },

  outStock: {
    color: "#e74c3c",
  },

  favButton: {
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  favActive: {
    backgroundColor: "#ffd6d6",
  },

  favText: {
    fontSize: 16,
    fontWeight: "600",
  },

  cartButton: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  cartText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
