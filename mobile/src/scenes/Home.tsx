import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableHighlight,
  Button,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameOptionsList: {
    display: "flex",
    flex: 1,
    flexGrow: 1,
    width: "100%",
    padding: 16,
    gap: 16,
  },
  card: {
    flexGrow: 1,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardIcon: {
    fontSize: 42,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#fff",
  },
});

export const Home = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Settings"
          onPress={() => navigation.navigate("Settings")}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.gameOptionsList}>
        <View style={{ display: "flex", gap: 16 }}>
          <Card
            option="create"
            onPress={() => navigation.navigate("Details")}
          />
          <Card option="join" onPress={() => console.log("Join Game")} />
          <Card
            option="spectate"
            onPress={() => console.log("Spectate Game")}
          />

          <Text style={{ textAlign: "center", color: "#a1a1a1", fontSize: 12 }}>
            It is required to have a username to create or join a match
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

interface CardProps {
  option: GameOption;
  onPress: () => void;
}

type GameOption = "join" | "create" | "spectate";

const cardColors = {
  join: ["#ff6ec4", "#7873f5"],
  create: ["#45cafc", "#303f9f"],
  spectate: ["#05ffa3", "#2096ff"],
};

const cardIcon = {
  join: "👥",
  create: "🎮",
  spectate: "👀",
};

const cardTitle = {
  join: "Join Game",
  create: "Create Game",
  spectate: "Spectate Game",
};

const Card: FC<CardProps> = ({ onPress, option }) => {
  return (
    <TouchableHighlight
      onPress={() => onPress()}
      underlayColor="white"
      style={{ borderRadius: 8 }}
    >
      <LinearGradient
        colors={cardColors[option]}
        style={{ ...styles.card }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 2 }}
      >
        <Text style={styles.cardIcon}>{cardIcon[option]}</Text>
        <Text style={styles.cardTitle}>{cardTitle[option]}</Text>
      </LinearGradient>
    </TouchableHighlight>
  );
};
