import React, { useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, Dimensions } from 'react-native';
import { BookItem } from '../types/book';
import { BookItemRow } from './BookItemRow';
import { useBooks } from '../context/BooksContext';
import { theme } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = -100; // Fixed 100px reveal
const DELETE_THRESHOLD = -SCREEN_WIDTH * 0.4; // 40% triggers delete

type SwipeableBookItemProps = {
  item: BookItem;
  onPress: () => void;
};

export const SwipeableBookItem = ({ item, onPress }: SwipeableBookItemProps) => {
  const { deleteBook } = useBooks();
  const translateX = useRef(new Animated.Value(0)).current;
  const [isDeleting, setIsDeleting] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes (left)
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontalSwipe && Math.abs(gestureState.dx) > 5 && gestureState.dx < 0;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // Capture the gesture if it's clearly a horizontal swipe
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontalSwipe && Math.abs(gestureState.dx) > 10 && gestureState.dx < 0;
      },
      onPanResponderGrant: () => {
        // Stop any ongoing animations when user starts swiping
        translateX.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow left swipe (negative values)
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < DELETE_THRESHOLD) {
          // Swipe far enough - delete the item
          handleDelete();
        } else if (gestureState.dx < SWIPE_THRESHOLD) {
          // Swipe to reveal delete button
          Animated.spring(translateX, {
            toValue: SWIPE_THRESHOLD,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        } else {
          // Snap back to original position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        // If gesture is interrupted, snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();
      },
    })
  ).current;

  const handleDelete = () => {
    setIsDeleting(true);
    // Animate off screen
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      deleteBook(item.id);
    });
  };

  // Calculate opacity for delete background based on swipe distance
  const deleteOpacity = translateX.interpolate({
    inputRange: [DELETE_THRESHOLD, SWIPE_THRESHOLD, 0],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  const deleteScale = translateX.interpolate({
    inputRange: [DELETE_THRESHOLD, SWIPE_THRESHOLD, 0],
    outputRange: [1.1, 1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <View className="relative">
      {/* Delete background */}
      <Animated.View 
        className="absolute right-0 top-0 bottom-0 justify-center items-end px-6 bg-red-600"
        style={{
          opacity: deleteOpacity,
          width: 150,
        }}
      >
        <Animated.View style={{ transform: [{ scale: deleteScale }] }}>
          <Text className="text-white font-semibold text-base">Delete</Text>
        </Animated.View>
      </Animated.View>

      {/* Swipeable content */}
      <Animated.View
        style={{
          transform: [{ translateX }],
          backgroundColor: theme.background,
        }}
        {...panResponder.panHandlers}
      >
        <View pointerEvents={isDeleting ? 'none' : 'auto'}>
          <BookItemRow item={item} onPress={onPress} />
        </View>
      </Animated.View>
    </View>
  );
};
