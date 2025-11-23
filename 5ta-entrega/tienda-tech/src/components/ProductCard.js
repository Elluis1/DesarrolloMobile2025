import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { toggleFavorite } from "../api/favorites";

export default function ProductCard({ product, favorites, reloadFavorites }) {
  const { user } = useContext(AuthContext);

  const [favorite, setFavorite] = useState(
    favorites.includes(product.id)
  );

  // Actualiza cuando cambian los favoritos externos
  useEffect(() => {
    setFavorite(favorites.includes(product.id));
  }, [favorites]);

  const handleFav = async () => {
    try {
      const result = await toggleFavorite(user.id, product.id);

      // cambia el estado local
      if (result.added) setFavorite(true);
      if (result.removed) setFavorite(false);

      // refresca favoritos en HomeScreen
      reloadFavorites();
    } catch (err) {
      console.log("❌ Error al cambiar favorito:", err);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{product.nombre}</Text>
      <Text style={styles.desc}>
        {product.descripcion?.[0]?.children?.[0]?.text}
      </Text>
      <Text style={styles.price}>💵 AR$ {product.precio}</Text>
      <Text style={styles.stock}>Stock: {product.stock}</Text>

      <TouchableOpacity
        style={[styles.favButton, favorite && styles.favActive]}
        onPress={handleFav}
      >
        <Text style={styles.favText}>
          {favorite ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stock: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  favButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    borderRadius: 8,
  },
  favActive: {
    backgroundColor: "#ffcccc",
  },
  favText: {
    textAlign: "center",
    fontWeight: "600",
  },
});
