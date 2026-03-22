import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Easing, LayoutChangeEvent } from 'react-native';
import { DitherFade } from './ui/DitherFade';
import Reanimated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text } from './Text';
import * as Haptics from 'expo-haptics';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { BookItem } from '../types/book';
import { BookItemRow } from './BookItemRow';
import { useBooks } from '../context/BooksContext';
import { theme } from '../theme/colors';

type SwipeableBookItemProps = {
  item: BookItem;
  onPress: () => void;
};

export const SwipeableBookItem = ({ item, onPress }: SwipeableBookItemProps) => {
  const { deleteBook } = useBooks();
  const swipeableRef = useRef<SwipeableMethods>(null);
  const highlightOpacity = useSharedValue(0);
  const highlightStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    opacity: highlightOpacity.value * 0.25,
  }));
  const rowHeight = useRef(0);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    rowHeight.current = Math.max(rowHeight.current, h);
  };

  useEffect(() => {
    if (!isDeleting) return;
    Animated.timing(heightAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start(() => {
      deleteBook(item.id);
    });
  }, [isDeleting]);

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    heightAnim.setValue(rowHeight.current);
    setIsDeleting(true);
  };

  const renderRightActions = () => (
    <View style={{ flex: 1 }} className="bg-red-600">

      {/* Top edge dither — dense at top, fading down */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
        <DitherFade direction="up" height={16} color={theme.dangerDark} background={theme.danger} />
      </View>

      <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }} className="justify-center px-6">
        <Text className="text-white font-semibold text-base" onPress={handleDelete}>
          Delete
        </Text>
      </View>
    </View>
  );

  return (
    <Animated.View
      style={isDeleting ? { height: heightAnim, overflow: 'hidden' } : {}}
      onLayout={handleLayout}
    >
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleDelete}
        rightThreshold={80}
      >
        <View style={{ backgroundColor: theme.background }}>
          <BookItemRow
            item={item}
            onPress={onPress}
            onPressIn={() => { highlightOpacity.value = withTiming(1, { duration: 200 }); }}
            onPressOut={() => { highlightOpacity.value = withTiming(0, { duration: 300 }); }}
          />
          <Reanimated.View style={highlightStyle} pointerEvents="none" />
        </View>
      </ReanimatedSwipeable>
    </Animated.View>
  );
};
