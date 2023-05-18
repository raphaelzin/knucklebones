import React, { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../contexts/ThemeContext";

export const Settings = () => {
  const [username, setUsername] = useState<string | undefined>(undefined);
  // const { theme, setTheme } = useContext(ThemeContext)

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.stack}>
        <Row title="Username">
          <TextInput style={styles.textInput} placeholder="yololo" />
        </Row>
        <Row title="Interface">
          <Text>Dark Mode</Text>
        </Row>
      </View>
    </ScrollView>
  );
};

const Row = ({ title, children }) => {
  return (
    <View>
      <TouchableHighlight
        style={styles.row}
        underlayColor="black"
        onPress={() => {
          console.log("touch");
        }}
      >
        <>
          <Text style={styles.rowTitle}>{title}</Text>
          {children}
        </>
      </TouchableHighlight>
      <Separator />
    </View>
  );
};

const Separator = () => {
  return (
    <View style={{ height: 1, backgroundColor: "#a1a1a1", opacity: 0.1 }} />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    width: "100%"
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  row: {
    padding: 16,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  rowTitle: {
    fontSize: 18
  },
  textInput: {
    fontSize: 18,
    minWidth: 100
  }
});
