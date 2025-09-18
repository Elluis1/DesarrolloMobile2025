import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { conferences } from "../data/conferences";
import { Conference } from "../types";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ConferenceList">;
};

const ConferenceList: React.FC<Props> = ({ navigation }) => {
  const renderItem = ({ item }: { item: Conference }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ConferenceDetail", { id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.speaker}</Text>
        <Text>{item.startTime} - {item.endTime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={conferences}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    margin: 8,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 6,
  },
  info: {
    marginLeft: 10,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ConferenceList;
