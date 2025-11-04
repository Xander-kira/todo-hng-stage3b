// app/_layout.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from '../lib/theme';
import { getTheme, saveTheme } from '../lib/storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Convex (realtime backend)
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Read from .env; don’t crash if missing so we can at least render UI
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL || '';
const convex = new ConvexReactClient(CONVEX_URL);

export const ThemeContext = React.createContext({
  mode: 'light' as 'light' | 'dark',
  toggle: () => {},
});

export default function RootLayout() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    (async () => {
      const saved = await getTheme();
      if (saved) setMode(saved as 'light' | 'dark');
    })();
  }, []);
  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  const ctx = useMemo(
    () => ({ mode, toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')) }),
    [mode]
  );
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <ThemeContext.Provider value={ctx}>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider>
              <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: theme.colors.card },
                  headerTintColor: theme.colors.text,
                  headerShadowVisible: false,
                  headerBackTitle: 'Back',
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen 
                  name="new" 
                  options={{ 
                    title: 'New Todo',
                    headerBackTitle: 'Home',
                  }} 
                />
                <Stack.Screen 
                  name="edit/[id]" 
                  options={{ 
                    title: 'Edit Todo',
                    headerBackTitle: 'Home',
                  }} 
                />
              </Stack>
            </SafeAreaProvider>
          </ThemeProvider>
        </ThemeContext.Provider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}
