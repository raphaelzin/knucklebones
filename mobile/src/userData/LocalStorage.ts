import AsyncStorage from "@react-native-async-storage/async-storage";

export type StorageValueKey = "selected-theme" | "user-name";

export const getStorageValue = async (
  key: StorageValueKey
): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setStorageValue = async (value: string, key: StorageValueKey) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};
