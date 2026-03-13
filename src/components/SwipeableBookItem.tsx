import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Easing, LayoutChangeEvent } from 'react-native';
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
  const rowHeight = useRef(0);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLayout = (e: LayoutChangeEvent) => {
    if (rowHeight.current === 0) {
      rowHeight.current = e.nativeEvent.layout.height;
    }
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
        <View pointerEvents="auto" style={{ backgroundColor: theme.background }}>
          <BookItemRow item={item} onPress={onPress} />
        </View>
      </ReanimatedSwipeable>
    </Animated.View>
  );
};
