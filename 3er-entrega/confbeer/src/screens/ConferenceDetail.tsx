import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { RouteProp } from "@react-navigation/native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { RootStackParamList } from "../../App";
import { conferences } from "../data/conferences";

type DetailScreenRouteProp = RouteProp<RootStackParamList, "ConferenceDetail">;

type Props = {
  route: DetailScreenRouteProp;
};

const ConferenceDetail: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const conference = conferences.find((c) => c.id === id);
  const [userLocation, setUserLocation] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  if (!conference) return <Text>Conferencia no encontrada</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: conference.image }} style={styles.image} />
      <Text style={styles.title}>{conference.title}</Text>
      <Text style={styles.speaker}>{conference.speaker}</Text>
      <Text>{conference.startTime} - {conference.endTime}</Text>
      <Text style={styles.description}>{conference.description}</Text>

      <Text style={styles.mapLabel}>Ubicación de la conferencia</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: conference.location.latitude,
          longitude: conference.location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={conference.location}
          title={conference.title}
          description={conference.speaker}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  speaker: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
  },
  mapLabel: {
    marginTop: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  map: {
    width: "100%",
    height: 250,
    borderRadius: 8,
  },
});

export default ConferenceDetail;
