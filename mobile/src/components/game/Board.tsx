import React from "react";
import { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import Die from "./Die/Die";

const styles = StyleSheet.create({
  slot: {
    width: 80,
    height: 60,
    backgroundColor: "rgb(32, 28, 24)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2
  },
  slotColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  board: {
    display: "flex",
    flexDirection: "row",
    gap: 16
  }
});

interface DieSlotProps {
  die?: number;
}

const DieSlot: FC<DieSlotProps> = ({ die }) => {
  return (
    <View style={styles.slot}>{die && <Die value={die} size={42} />}</View>
  );
};

type SlotDisplayType = "top-down" | "bottom-up";

interface SlotColumnProps {
  column: Column;
  size: number;
  displayType: SlotDisplayType;
}

const SlotColumn: FC<SlotColumnProps> = ({ column, size, displayType }) => {
  const arr = [...Array(size).keys()];

  const slots = arr.map(i => (
    <DieSlot key={i} die={i < size ? column.dice[i] : undefined} />
  ));

  slots.unshift(
    <Text style={{ textAlign: "center", marginTop: 0 }}>{column.value}</Text>
  );

  return (
    <View style={styles.slotColumn}>
      {displayType === "top-down" ? slots : slots.reverse()}
    </View>
  );
};

interface Column {
  dice: number[];
  value: number;
}

interface BoardProps {
  columnCount: number;
  rowCount: number;
  columns: Column[];
  displayType: SlotDisplayType;
}

export const Board: FC<BoardProps> = ({
  columnCount,
  rowCount,
  columns,
  displayType
}) => {
  const arr = [...Array(columnCount).keys()];
  return (
    <View style={styles.board}>
      {arr.map(i => (
        <SlotColumn
          key={i}
          column={columns[i]}
          size={rowCount}
          displayType={displayType}
        />
      ))}
    </View>
  );
};
