import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Board } from "../components/game/Board";
import { DiceContainer } from "../components/game/DiceContainer";
// import { DiceContainer } from "../components/game/DiceContainer";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 42,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

export const Details = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Board
        columnCount={3}
        rowCount={3}
        columns={[
          { dice: [1, 2], value: 3 },
          { dice: [2], value: 2 },
          { dice: [3, 4, 5], value: 12 },
        ]}
        displayType="bottom-up"
      />
      <DiceContainer />
      <Board
        columnCount={3}
        rowCount={3}
        columns={[
          { dice: [1, 2], value: 3 },
          { dice: [2], value: 2 },
          { dice: [3, 4, 5], value: 12 },
        ]}
        displayType="top-down"
      />
    </SafeAreaView>
  );
};
