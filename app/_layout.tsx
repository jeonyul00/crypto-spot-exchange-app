import React, { useEffect, useCallback } from "react";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const onReady = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: true,
              headerStyle: { backgroundColor: "#fff" },
            }}
          >
            <Stack.Screen name="index" options={{ headerTitle: "Coin List" }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
