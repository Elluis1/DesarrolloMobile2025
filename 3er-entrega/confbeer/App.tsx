import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ConferenceList from "./src/screens/ConferenceList";
import ConferenceDetail from "./src/screens/ConferenceDetail";
import MapScreen from "./src/screens/MapScreen";

export type RootStackParamList = {
  ConferenceList: undefined;
  ConferenceDetail: { id: string };
  Map: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ConferenceList">
        <Stack.Screen name="ConferenceList" component={ConferenceList} options={{ title: "Conferencias" }} />
        <Stack.Screen name="ConferenceDetail" component={ConferenceDetail} options={{ title: "Detalle" }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: "Mapa" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
