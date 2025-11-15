import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hola Mundo</Text>
      <StatusBar style="auto" />
    </View>
  );
}
