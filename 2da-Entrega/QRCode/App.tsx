import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Camera, CameraView, BarcodeScanningResult } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type ScanEntry = {
  id: string;
  value: string;
  type: string;
  at: string;
};

const STORAGE_KEY = "@scan_history_v2";

export default function App() {
  const [input, setInput] = useState<string>("Hola mundo");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [loadingPerm, setLoadingPerm] = useState(false);
  const [history, setHistory] = useState<ScanEntry[]>([]);

  // animación de la línea roja
  const translateY = useSharedValue(0);
  const animatedLine = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // cargar historial
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setHistory(JSON.parse(raw));
      } catch (e) {
        console.warn("Error leyendo historial", e);
      }
    })();
  }, []);

  // pedir permisos de cámara
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      setLoadingPerm(true);
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);
      setLoadingPerm(false);
      return granted;
    } catch (e) {
      setHasPermission(false);
      setLoadingPerm(false);
      return false;
    }
  };

  const openScanner = async () => {
    if (hasPermission !== true) {
      const granted = await requestCameraPermission();
      if (!granted) {
        Alert.alert(
          "Permiso de cámara",
          "No se concedió permiso de cámara. Activá la cámara en configuración."
        );
        return;
      }
    }
    setScannerVisible(true);
    translateY.value = withRepeat(withTiming(200, { duration: 1500 }), -1, true);
  };

  const closeScanner = () => {
    setScannerVisible(false);
    translateY.value = 0;
  };

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    const { data, type } = result;
    if (!data) return;

    setScannedValue(data);
    setScannerVisible(false);

    const newEntry: ScanEntry = {
      id: Date.now().toString(),
      value: data,
      type: type || "UNKNOWN",
      at: new Date().toISOString(),
    };
    const newHistory = [newEntry, ...history].slice(0, 100);
    setHistory(newHistory);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const copyScanned = async () => {
    if (!scannedValue) return;
    await Clipboard.setStringAsync(scannedValue);
    Alert.alert("Copiado", "Valor copiado al portapapeles.");
  };

  const parsePAY = (value: string) => {
    if (!value.startsWith("PAY:")) return null;
    const parts = value.slice(4).split("|");
    if (parts.length !== 3) return null;
    const [id, monto, currency] = parts;
    const montoNum = Number(monto);
    if (Number.isNaN(montoNum) || currency !== "ARS") return null;
    return { id, monto: montoNum, currency };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>QR + Scanner con TS (CameraView)</Text>

      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Texto para codificar"
      />

      <View style={styles.qrWrap}>
        <QRCode value={input || " "} size={180} />
      </View>

      <View style={styles.row}>
        <Button title="Escanear" onPress={openScanner} />
        <View style={{ width: 12 }} />
        <Button title="Borrar último" onPress={() => setScannedValue(null)} />
      </View>

      {scannedValue && (
        <View style={styles.section}>
          <Text style={styles.label}>Último escaneado:</Text>
          <Text style={styles.value}>{scannedValue}</Text>

          {parsePAY(scannedValue) && (
            <View style={styles.payBox}>
              <Text>Pago válido:</Text>
              <Text>ID: {parsePAY(scannedValue)?.id}</Text>
              <Text>
                Monto: {parsePAY(scannedValue)?.monto}{" "}
                {parsePAY(scannedValue)?.currency}
              </Text>
            </View>
          )}

          <Button title="Copiar" onPress={copyScanned} />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Historial</Text>
        <FlatList
          data={history}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.histItem}>
              <Text numberOfLines={1}>{item.value}</Text>
              <Text style={styles.histDate}>
                {new Date(item.at).toLocaleString()}
              </Text>
            </View>
          )}
        />
      </View>

      {scannerVisible && (
        <View style={styles.scannerOverlay}>
          {loadingPerm ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417"],
                }}
              />
              <View style={styles.scanFrame}>
                <Animated.View style={[styles.scanLine, animatedLine]} />
              </View>
              <View style={styles.scanBottom}>
                <Button
                  title="Cerrar"
                  onPress={closeScanner}
                  color={Platform.OS === "ios" ? "#fff" : undefined}
                />
              </View>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
  },
  qrWrap: { alignItems: "center", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "center", marginVertical: 8 },
  section: { marginVertical: 12 },
  label: { fontWeight: "700", marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "600" },
  payBox: { marginTop: 8, padding: 8, backgroundColor: "#eef", borderRadius: 6 },
  histItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  histDate: { fontSize: 12, color: "#666" },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#00ff00",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 2,
    backgroundColor: "red",
  },
  scanBottom: { position: "absolute", bottom: 40 },
});
