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

export default function HomeScreen() {
  const { user } = useContext(AuthContext);

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
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      <View style={styles.container}>
        {/* Búsqueda */}
        <TextInput
          placeholder="Buscar producto..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />

        {/* Filtros de categoría */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setFilterCategory(filterCategory === item.id ? null : item.id)
                }
                style={[
                  styles.filterButton,
                  filterCategory === item.id && styles.filterActive,
                ]}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Filtros de marca */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            data={brands}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setFilterBrand(filterBrand === item.id ? null : item.id)
                }
                style={[
                  styles.filterButton,
                  filterBrand === item.id && styles.filterActive,
                ]}
              >
                <Text>{item.nombre}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Filtro por precio */}
        <View style={styles.priceContainer}>
          <TextInput
            placeholder="Precio mínimo"
            value={priceMin}
            onChangeText={setPriceMin}
            keyboardType="numeric"
            style={styles.priceInput}
          />
          <TextInput
            placeholder="Precio máximo"
            value={priceMax}
            onChangeText={setPriceMax}
            keyboardType="numeric"
            style={styles.priceInput}
          />
        </View>

        <FlatList
          data={filteredProducts.filter((p) => p != null)} // 🔹 filtro extra de seguridad
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              favorites={favorites}
              reloadFavorites={loadFavorites}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    margin: 12,
  },
  filtersContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterActive: {
    backgroundColor: "#ffcccc",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginBottom: 12,
  },
  priceInput: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    width: "48%",
  },
});
