import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { getUserFavorites } from "../api/favorites";
import { useCart } from "../context/CartContext";

export default function HomeScreen() {
  const { user, logout } = useContext(AuthContext);
  const { clearCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Cargar productos
  const loadData = async () => {
    try {
      setLoading(true);
      const resProducts = await fetch(`${API_URL}/products?populate=*`);
      const jsonProducts = await resProducts.json();
      console.log("✅ Productos cargados:", jsonProducts.data);
      setAllProducts(jsonProducts.data);
      setFilteredProducts(jsonProducts.data);

      const resCategories = await fetch(`${API_URL}/categories`);
      const jsonCategories = await resCategories.json();
      setCategories(jsonCategories.data);

      const resBrands = await fetch(`${API_URL}/marcas`);
      const jsonBrands = await resBrands.json();
      setBrands(jsonBrands.data);

      await loadFavorites();
    } catch (err) {
      console.log("❌ Error cargando data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      if (!user?.id) return;
      const favIds = await getUserFavorites(user.id);
      setFavorites(favIds);
    } catch (err) {
      console.log("❌ Error cargando favoritos:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let temp = [...allProducts];

    if (filterCategory) {
      temp = temp.filter((p) => p.category?.id === filterCategory);
    }
    if (filterBrand) {
      temp = temp.filter((p) => p.marca?.id === filterBrand);
    }
    if (search) {
      temp = temp.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (priceMin) {
      temp = temp.filter((p) => p.precio >= parseFloat(priceMin));
    }
    if (priceMax) {
      temp = temp.filter((p) => p.precio <= parseFloat(priceMax));
    }

    setFilteredProducts(temp);
  }, [search, filterCategory, filterBrand, priceMin, priceMax, allProducts]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola 👋</Text>
          <Text style={styles.username}>{user?.username || "Usuario"}</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            clearCart();
            logout();
          }}
        >
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="🔍 Buscar productos..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* FILTROS CATEGORÍA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                setFilterCategory(filterCategory === item.id ? null : item.id)
              }
              style={[
                styles.chip,
                filterCategory === item.id && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  filterCategory === item.id && styles.chipTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* FILTROS MARCA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marcas</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={brands}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                setFilterBrand(filterBrand === item.id ? null : item.id)
              }
              style={[
                styles.chip,
                filterBrand === item.id && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  filterBrand === item.id && styles.chipTextActive,
                ]}
              >
                {item.nombre}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* PRODUCTOS */}
      <FlatList
        data={filteredProducts.filter((p) => p != null)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 6 }}>
            <ProductCard
              product={item}
              favorites={favorites}
              reloadFavorites={loadFavorites}
            />
          </View>
        )}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    elevation: 4,
  },

  greeting: {
    fontSize: 16,
    color: "#666",
  },

  username: {
    fontSize: 20,
    fontWeight: "bold",
  },

  logoutButton: {
    backgroundColor: "#111",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },

  searchContainer: {
    padding: 16,
  },

  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    elevation: 3,
  },

  section: {
    paddingLeft: 16,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  chip: {
    backgroundColor: "#e5e5e5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },

  chipActive: {
    backgroundColor: "#111",
  },

  chipText: {
    color: "#333",
    fontSize: 14,
  },

  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
