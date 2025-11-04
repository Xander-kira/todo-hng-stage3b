import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@theme';

export async function getTheme(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export async function saveTheme(theme: string): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}
