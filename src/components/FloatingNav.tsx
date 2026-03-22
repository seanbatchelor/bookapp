import React from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./Text";
import { RootStackParamList } from "../types/navigation";

const ITEMS: { label: string; route: keyof RootStackParamList }[] = [
  { label: "List", route: "Home" },
  { label: "Library", route: "Library" },
];

type FloatingNavProps = {
  currentRouteName: keyof RootStackParamList;
  onNavigateToTab: (route: keyof RootStackParamList) => void;
};

export function FloatingNav({
  currentRouteName,
  onNavigateToTab,
}: FloatingNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-6 flex-row rounded-full overflow-hidden bg-primary"
      style={{ bottom: 12 + insets.bottom }}
    >
      {ITEMS.map((item, index) => {
        const isActive = currentRouteName === item.route;
        const isLast = index === ITEMS.length - 1;

        return (
          <React.Fragment key={item.route}>
            <Pressable
              onPress={() => {
                if (!isActive) onNavigateToTab(item.route);
              }}
              className="px-6 py-3.5"
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Text
                className={
                  isActive
                    ? "font-semibold text-white"
                    : "font-medium text-white/50"
                }
                style={{ fontSize: 15, lineHeight: 20 }}
              >
                {item.label}
              </Text>
            </Pressable>

            {!isLast && <View className="w-px my-3 bg-white/25" />}
          </React.Fragment>
        );
      })}
    </View>
  );
}
