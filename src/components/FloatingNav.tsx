import { useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./Text";
import { DitherPill } from "./ui/DitherPill";
import { green } from "../theme";

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
  const [pillSize, setPillSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const onPillLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) setPillSize({ width, height });
  };

  // FAB: bottom: 12 + insets.bottom, height 56 → centre at +28 from bottom.
  // Nav pill with py-3.5 is ~48px tall → centre at +24. Offset by +4 to align centres.
  const bottom = 16 + insets.bottom;

  return (
    <View style={{ position: "absolute", bottom, left: 16 }}>
      {pillSize !== null && (
        <View style={{ position: "absolute", top: 10, left: 5 }}>
          <DitherPill width={pillSize.width} height={pillSize.height} />
        </View>
      )}

      <View
        onLayout={onPillLayout}
        className="flex-row rounded-full overflow-hidden bg-primary"
      >
        {ITEMS.map((item) => {
          const isActive = activeTab === item.tab;

          return (
            <Pressable
              key={item.tab}
              onPress={() => {
                if (!isActive) onNavigateToTab(item.tab);
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                marginVertical: 4,
                marginHorizontal: 2,
              })}
            >
              <View
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 999,
                  backgroundColor: isActive ? green[700] : "transparent",
                }}
              >
                <Text
                  className={isActive ? "font-medium" : "font-medium"}
                  style={{
                    fontSize: 15,
                    lineHeight: 20,
                    color: "#FFFFFF",
                  }}
                >
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
