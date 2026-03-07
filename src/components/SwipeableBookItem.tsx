import React, { useRef } from 'react';
import { View, Text } from 'react-native';
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

  const handleDelete = () => {
    swipeableRef.current?.close();
    deleteBook(item.id);
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
  );
};
