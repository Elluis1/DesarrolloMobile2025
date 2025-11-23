import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doRegister = async () => {
    try {
      await register(username, email, password);
    } catch (err) {
      alert("Error registrando usuario");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Usuario</Text>
      <TextInput style={{ borderWidth: 1 }} value={username} onChangeText={setUsername} />

      <Text>Email</Text>
      <TextInput style={{ borderWidth: 1 }} value={email} onChangeText={setEmail} />

      <Text>Password</Text>
      <TextInput
        style={{ borderWidth: 1 }}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Registrarse" onPress={doRegister} />

      <Button
        title="Volver al login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}
