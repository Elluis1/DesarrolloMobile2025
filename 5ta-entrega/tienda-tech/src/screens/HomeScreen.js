import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { getUserFavorites } from "../api/favorites";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [user])
  );

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // HomeScreen.js
  const loadFavorites = async () => {
    try {
      const favIds = await getUserFavorites(user.id);
      setFavorites(favIds);
    } catch (err) {
      console.log("❌ Error cargando favoritos:", err);
    }
  };

  const loadData = async () => {
    try {
      // Cargar productos
      const res = await fetch(`${API_URL}/products`);
      const json = await res.json();
      setProducts(json.data);

      // Cargar favoritos del usuario
      const favIds = await getUserFavorites(user.id);
      setFavorites(favIds);
    } catch (err) {
      console.log("❌ Error cargando data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard product={item} favorites={favorites} reloadFavorites={loadFavorites}/>
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
