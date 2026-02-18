import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { toggleFavorite } from "../api/favorites";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../api/auth";

export default function ProductCard({ product, favorites, reloadFavorites }) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [favorite, setFavorite] = useState(favorites.includes(product.id));

  useEffect(() => {
    setFavorite(favorites.includes(product.id));
  }, [favorites]);

  const baseUrl = API_URL.replace("/api", "");

  const imageUrl =
    product.imagenes && product.imagenes.length > 0
      ? `${baseUrl}${
          product.imagenes[0].formats?.small?.url ||
          product.imagenes[0].url
        }`
      : null;

  const handleFav = async () => {
    try {
      const result = await toggleFavorite(user.id, product.id);

      if (result.added) setFavorite(true);
      if (result.removed) setFavorite(false);

      reloadFavorites();
    } catch (err) {
      console.log("❌ Error al cambiar favorito:", err);
    }
  };

  const discountedPrice =
    product.descuento > 0
      ? product.precio - (product.precio * product.descuento) / 100
      : null;

  return (
    <View style={styles.card}>
      {/* Imagen */}
      <View style={styles.imageContainer}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Corazón flotante */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleFav}
        >
          <Text style={styles.heart}>
            {favorite ? "❤️" : "🤍"}
          </Text>
        </TouchableOpacity>

        {/* Badge descuento */}
        {product.descuento > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{product.descuento}%
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {product.nombre}
        </Text>

        {/* Precio */}
        {discountedPrice ? (
          <>
            <Text style={styles.oldPrice}>
              AR$ {product.precio}
            </Text>
            <Text style={styles.price}>
              AR$ {discountedPrice.toFixed(0)}
            </Text>
          </>
        ) : (
          <Text style={styles.price}>
            AR$ {product.precio}
          </Text>
        )}

        {/* Stock dinámico */}
        <Text
          style={[
            styles.stock,
            product.stock > 5
              ? styles.inStock
              : styles.lowStock,
          ]}
        >
          {product.stock > 0
            ? `Stock: ${product.stock}`
            : "Sin stock"}
        </Text>

        {/* Botón detalle */}
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() =>
            navigation.navigate("Home", {
              screen: "ProductDetail",
              params: { product, favorites },
            })
          }
        >
          <Text style={styles.detailText}>
            Ver detalle
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 6,
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 200,
  },

  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 6,
    elevation: 4,
  },

  heart: {
    fontSize: 18,
  },

  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ff3b3b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  infoContainer: {
    padding: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },

  oldPrice: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
  },

  stock: {
    fontSize: 13,
    marginBottom: 12,
  },

  inStock: {
    color: "green",
  },

  lowStock: {
    color: "orange",
  },

  detailButton: {
    backgroundColor: "#111",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  detailText: {
    color: "#fff",
    fontWeight: "600",
  },
});
