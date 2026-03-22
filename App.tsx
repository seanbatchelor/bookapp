import "./global.css";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import { BooksProvider } from "./src/context/BooksContext";
import { FloatingNav } from "./src/components/FloatingNav";
import HomeScreen from "./src/screens/HomeScreen";
import LibraryScreen from "./src/screens/LibraryScreen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [activeTab, setActiveTab] = useState<"Home" | "Library">("Home");

  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics ?? undefined}>
        <BooksProvider>
          <View style={{ flex: 1 }}>
            <View
              style={{ flex: 1, display: activeTab === "Home" ? "flex" : "none" }}
            >
              <HomeScreen />
            </View>
            <View
              style={{
                flex: 1,
                display: activeTab === "Library" ? "flex" : "none",
              }}
            >
              <LibraryScreen />
            </View>
            <FloatingNav activeTab={activeTab} onNavigateToTab={setActiveTab} />
          </View>
          <StatusBar style="auto" />
        </BooksProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
