/* eslint-disable react/no-array-index-key */
import React, { FC } from "react";
import { View, StyleSheet } from "react-native";

interface DieProps {
  value: number;
  size: number;
}

const styles = StyleSheet.create({
  pip: {
    backgroundColor: "#333",
    shadowColor: "#111",
    justifyContent: "center",
    alignSelf: "center",
  },
  pipColumn: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  face: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#d1c3c3",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowColor: "#bbb",
  },
});

const DieProportions = {
  face: {
    width: 104,
    height: 104,
    borderRadius: 10,
    padding: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  pip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowOffset: { width: 0, height: -3 },
  },
} as const;

const transformDiceProportions = (size: number) => {
  const factor = size / DieProportions.face.height;
  return {
    face: {
      width: size,
      height: size,
      borderRadius: DieProportions.face.borderRadius * factor,
      padding: DieProportions.face.padding * factor,
      shadowOffset: {
        width: DieProportions.face.shadowOffset.width * factor,
        height: DieProportions.face.shadowOffset.height * factor,
      },
    },
    pip: {
      height: DieProportions.pip.height * factor,
      width: DieProportions.pip.width * factor,
      borderRadius: DieProportions.pip.borderRadius * factor,
      shadowOffset: {
        width: DieProportions.pip.shadowOffset.width * factor,
        height: DieProportions.pip.shadowOffset.height * factor,
      },
    },
  };
};

const pipConfig = {
  1: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  2: [
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 1],
  ],
  3: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  4: [
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1],
  ],
  5: [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  6: [
    [1, 1, 1],
    [0, 0, 0],
    [1, 1, 1],
  ],
};

const PipFace: FC<{ value: number; size?: number }> = ({
  value,
  size = 104,
}) => {
  const { face: faceStyle, pip: pipStyle } = transformDiceProportions(size);

  return (
    <View style={{ ...styles.face, ...faceStyle }}>
      {value <= 6 &&
        pipConfig[value]!.map((column: number[], j) => (
          <View style={styles.pipColumn} key={j}>
            {column.map((pip, i) => (
              <>
                {pip === 1 ? (
                  <View style={{ ...styles.pip, ...pipStyle }} key={i} />
                ) : (
                  <View key={i} style={{ flexGrow: 1 }} />
                )}
              </>
            ))}
          </View>
        ))}
    </View>
  );
};

PipFace.defaultProps = {
  size: 104,
};

const Die: FC<DieProps> = ({ value, size }) => {
  return <PipFace value={value} size={size} />;
};

export default Die;
