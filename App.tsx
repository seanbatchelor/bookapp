import "./global.css";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import { RootStackParamList } from "./src/types/navigation";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const navigationRef = useRef(createNavigationContainerRef<RootStackParamList>())
    .current;
  const lastRouteNameRef = useRef<keyof RootStackParamList>("Home");
  const [currentRouteName, setCurrentRouteName] =
    useState<keyof RootStackParamList>("Home");

  const syncCurrentRoute = () => {
    const route = navigationRef.getCurrentRoute();
    const name = route?.name;
    if (name !== "Home" && name !== "Library") return;
    if (lastRouteNameRef.current === name) return;
    lastRouteNameRef.current = name;
    setCurrentRouteName(name);
  };

  /** Updates tab UI immediately; `onStateChange` still syncs back gesture / other navigators. */
  const navigateToTab = (name: keyof RootStackParamList) => {
    if (name !== "Home" && name !== "Library") return;
    if (lastRouteNameRef.current !== name) {
      lastRouteNameRef.current = name;
      setCurrentRouteName(name);
    }
    if (navigationRef.isReady()) {
      navigationRef.navigate(name);
    }
  };

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
      <SafeAreaProvider
        initialMetrics={initialWindowMetrics ?? undefined}
      >
        <BooksProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={syncCurrentRoute}
            onStateChange={syncCurrentRoute}
          >
            <View style={{ flex: 1 }}>
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerShown: false,
                  animation: "none",
                }}
              >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Library" component={LibraryScreen} />
              </Stack.Navigator>
              <FloatingNav
                currentRouteName={currentRouteName}
                onNavigateToTab={navigateToTab}
              />
            </View>
            <StatusBar style="auto" />
          </NavigationContainer>
        </BooksProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
