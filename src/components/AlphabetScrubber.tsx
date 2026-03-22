import React, { useRef, useCallback } from "react";
import {
  View,
  PanResponder,
  LayoutChangeEvent,
  FlatList,
  type LayoutRectangle,
} from "react-native";
import { Text } from "./Text";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetScrubberProps {
  listRef: React.RefObject<FlatList<any> | null>;
  letterIndexMap: Record<string, number>;
  itemCount: number;
}

function findNearestIndex(
  letter: string,
  letterIndexMap: Record<string, number>,
): number | null {
  const pos = LETTERS.indexOf(letter);
  if (pos === -1) return null;

  for (let offset = 0; offset <= 25; offset++) {
    // Check both directions: above then below
    for (const dir of [0, 1]) {
      const candidate = LETTERS[pos + (dir === 0 ? -offset : offset)];
      if (candidate && letterIndexMap[candidate] != null) {
        return letterIndexMap[candidate];
      }
    }
  }
  return null;
}

export function AlphabetScrubber({
  listRef,
  letterIndexMap,
  itemCount,
}: AlphabetScrubberProps) {
  const trackHeightRef = useRef(0);
  const trackTopRef = useRef(0);
  const innerRef = useRef<View>(null);

  const scrollToLetter = useCallback(
    (y: number) => {
      if (trackHeightRef.current === 0) return;

      const clampedY = Math.max(0, Math.min(y, trackHeightRef.current));
      const letterIndex = Math.floor(
        (clampedY / trackHeightRef.current) * LETTERS.length,
      );
      const clampedLetterIndex = Math.min(letterIndex, LETTERS.length - 1);
      const letter = LETTERS[clampedLetterIndex];

      const flatListIndex = findNearestIndex(letter, letterIndexMap);
      if (flatListIndex == null || itemCount === 0) return;

      const safeIndex = Math.min(flatListIndex, itemCount - 1);
      try {
        listRef.current?.scrollToIndex({
          index: safeIndex,
          animated: false,
          viewPosition: 0,
        });
      } catch {
        // scrollToIndex can throw if the list hasn't measured yet; silently ignore
      }
    },
    [letterIndexMap, listRef, itemCount],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const localY = evt.nativeEvent.pageY - trackTopRef.current;
        scrollToLetter(localY);
      },
      onPanResponderMove: (evt) => {
        const localY = evt.nativeEvent.pageY - trackTopRef.current;
        scrollToLetter(localY);
      },
    }),
  ).current;

  const syncTrackMetrics = useCallback((layout: LayoutRectangle) => {
    trackHeightRef.current = layout.height;
    innerRef.current?.measureInWindow((_x, y) => {
      trackTopRef.current = y;
    });
  }, []);

  const onTrackLayout = useCallback(
    (e: LayoutChangeEvent) => {
      syncTrackMetrics(e.nativeEvent.layout);
    },
    [syncTrackMetrics],
  );

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 28,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        ref={innerRef}
        collapsable={false}
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
        style={{
          width: 28,
          paddingVertical: 8,
          alignItems: "center",
        }}
      >
        {LETTERS.map((letter) => {
          const hasEntries = letterIndexMap[letter] != null;
          return (
            <Text
              key={letter}
              style={{
                fontSize: 13,
                lineHeight: 16,
                color: hasEntries ? "#237040" : "rgba(35,112,64,0.35)",
                fontWeight: "700",
              }}
            >
              {letter}
            </Text>
          );
        })}
      </View>
    </View>
  );
}
