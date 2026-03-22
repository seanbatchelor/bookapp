import React from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./Text";

type Tab = "Home" | "Library";

const ITEMS: { label: string; tab: Tab }[] = [
  { label: "List", tab: "Home" },
  { label: "Library", tab: "Library" },
];

type FloatingNavProps = {
  activeTab: Tab;
  onNavigateToTab: (tab: Tab) => void;
};

export function FloatingNav({ activeTab, onNavigateToTab }: FloatingNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-6 flex-row rounded-full overflow-hidden bg-primary"
      style={{ bottom: 12 + insets.bottom }}
    >
      {ITEMS.map((item, index) => {
        const isActive = activeTab === item.tab;
        const isLast = index === ITEMS.length - 1;

        return (
          <React.Fragment key={item.tab}>
            <Pressable
              onPress={() => {
                if (!isActive) onNavigateToTab(item.tab);
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
