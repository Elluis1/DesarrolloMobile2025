import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {styles} from './styles/styles';

type PokemonItem = {
  name: string;
  url: string;
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonItem[];
};

export default function App() {
  const INITIAL_URL = "https://pokeapi.co/api/v2/pokemon?limit=50";

  const [data, setData] = useState<PokemonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // initial loader
  const [refreshing, setRefreshing] = useState<boolean>(false); // pull-to-refresh
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  // pagination
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(INITIAL_URL);

  // simple in-memory cache to avoid flicker between pages
  const cacheRef = useRef<Map<string, ApiResponse>>(new Map());

  // fetch function using native fetch
  const fetchList = async (url: string, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // serve from cache if present (instant)
      const cached = cacheRef.current.get(url);
      if (cached) {
        setData(cached.results);
        setNextUrl(cached.next);
        setPrevUrl(cached.previous);
        return cached;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json: ApiResponse = await res.json();

      // cache
      cacheRef.current.set(url, json);

      setData(json.results);
      setNextUrl(json.next);
      setPrevUrl(json.previous);

      return json;
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Error de red");
      setData([]); // clear shown data on error (you could keep cached if exists)
      return null;
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchList(currentUrl, true);
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl]);

  // pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      // force refetch: bypass cache by removing from cache then fetch
      cacheRef.current.delete(currentUrl);
      await fetchList(currentUrl, false);
    } finally {
      setRefreshing(false);
    }
  };

  // go to next / previous page (keeps cache)
  const goTo = (url: string | null) => {
    if (!url) return;
    setCurrentUrl(url);
    // loading handled by effect since currentUrl changes
  };

  // filtered list memoized
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.trim().toLowerCase();
    return data.filter((p) => p.name.toLowerCase().includes(q));
  }, [data, search]);

  // UI pieces
  const renderItem = ({ item }: { item: PokemonItem }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>PokéList</Text>
      </View>

      {/* Search input */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Buscar por nombre..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <Button title="Clear" onPress={() => setSearch("")} />
      </View>

      {/* Pagination controls */}
      <View style={styles.pagination}>
        <Button title="Prev" onPress={() => goTo(prevUrl)} disabled={!prevUrl} />
        <Button title="Next" onPress={() => goTo(nextUrl)} disabled={!nextUrl} />
      </View>

      {/* Initial loading indicator */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.hint}>Cargando lista...</Text>
        </View>
      ) : error ? (
        // Error view (allows pull-to-refresh to retry too)
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.hint}>Hacé pull-to-refresh para reintentar.</Text>
        </View>
      ) : (
        <>
          {/* "No results" when filter yields nothing */}
          {filtered.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.hint}>Sin resultados para “{search}”</Text>
            </View>
          ) : null}

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.name}
            renderItem={renderItem}
            contentContainerStyle={filtered.length === 0 ? styles.flatEmpty : undefined}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            // small optimization props
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            windowSize={11}
          />
        </>
      )}
    </SafeAreaView>
  );
}
