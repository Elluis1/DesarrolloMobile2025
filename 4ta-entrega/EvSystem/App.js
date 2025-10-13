import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CreateTransactionScreen from "./src/screens/CreateTransactionScreen";
import LiveEventsScreen from "./src/screens/LiveEventsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Transacción" component={CreateTransactionScreen} />
        <Tab.Screen name="Eventos en vivo" component={LiveEventsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
