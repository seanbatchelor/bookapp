import React, { useRef, useCallback } from 'react';
import { View, PanResponder, LayoutChangeEvent, FlatList } from 'react-native';
import { Text } from './Text';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface AlphabetScrubberProps {
  listRef: React.RefObject<FlatList<any> | null>;
  letterIndexMap: Record<string, number>;
  itemCount: number;
}

function findNearestIndex(
  letter: string,
  letterIndexMap: Record<string, number>
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

export function AlphabetScrubber({ listRef, letterIndexMap, itemCount }: AlphabetScrubberProps) {
  const containerHeightRef = useRef(0);
  const containerTopRef = useRef(0);

  const scrollToLetter = useCallback(
    (y: number) => {
      if (containerHeightRef.current === 0) return;

      const clampedY = Math.max(0, Math.min(y, containerHeightRef.current));
      const letterIndex = Math.floor((clampedY / containerHeightRef.current) * LETTERS.length);
      const clampedLetterIndex = Math.min(letterIndex, LETTERS.length - 1);
      const letter = LETTERS[clampedLetterIndex];

      const flatListIndex = findNearestIndex(letter, letterIndexMap);
      if (flatListIndex == null || itemCount === 0) return;

      const safeIndex = Math.min(flatListIndex, itemCount - 1);
      try {
        listRef.current?.scrollToIndex({ index: safeIndex, animated: false, viewPosition: 0 });
      } catch {
        // scrollToIndex can throw if the list hasn't measured yet; silently ignore
      }
    },
    [letterIndexMap, listRef, itemCount]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const localY = evt.nativeEvent.pageY - containerTopRef.current;
        scrollToLetter(localY);
      },
      onPanResponderMove: (evt) => {
        const localY = evt.nativeEvent.pageY - containerTopRef.current;
        scrollToLetter(localY);
      },
    })
  ).current;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    containerHeightRef.current = e.nativeEvent.layout.height;
    // measure absolute Y position so we can compute local offset from pageY
    e.target.measure((_x, _y, _w, _h, _pageX, pageY) => {
      containerTopRef.current = pageY;
    });
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 28,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
      }}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      {LETTERS.map((letter) => {
        const hasEntries = letterIndexMap[letter] != null;
        return (
          <Text
            key={letter}
            style={{
              fontSize: 11,
              lineHeight: 13,
              color: hasEntries ? '#237040' : 'rgba(35,112,64,0.35)',
              fontWeight: '600',
            }}
          >
            {letter}
          </Text>
        );
      })}
    </View>
  );
}
