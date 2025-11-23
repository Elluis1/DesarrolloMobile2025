import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../api/auth";
import { useFocusEffect } from "@react-navigation/native";



export default function FavoritesScreen() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [user])
  );

  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/favorites?filters[user][id][$eq]=${user.id}&populate=product`
      );
      const json = await res.json();
      console.log("⭐ Favoritos cargados:", json.data);

      // Extraemos los objetos completos de producto
      const products = json.data
        .map(fav => fav.product)
        .filter(Boolean); // descartamos nulls
      setFavorites(products);
    } catch (err) {
      console.log("❌ Error cargando favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  if (!user || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No tienes productos favoritos 😢</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            favorites={favorites.map(p => p.id)}
            reloadFavorites={fetchFavorites}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
