import React, { useRef, useEffect } from 'react';
import { View, TextInput, Pressable, Animated, GestureResponderEvent } from 'react-native';
import { Text } from './Text';
import { Plus, Check, ArrowDown, Loader2 } from 'lucide-react-native';
import { BookItem } from '../types/book';
import { useBooks } from '../context/BooksContext';
import { theme } from '../theme/colors';

type BookItemRowProps = {
  item: BookItem;
  onPress: () => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
};

export const BookItemRow = ({ item, onPress, onPressIn, onPressOut }: BookItemRowProps) => {
  const { updateBookText, lookupBook, markAsRead, setBookState } = useBooks();
  const inputRef = useRef<TextInput>(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(4)).current;

  useEffect(() => {
    if (item.state === 'EMPTY') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [item.state]);

  useEffect(() => {
    if (item.state === 'SEARCHING') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [item.state]);

  useEffect(() => {
    if (item.state === 'UNSEARCHED') {
      subtitleOpacity.setValue(0);
      subtitleSlide.setValue(4);
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(subtitleSlide, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      }, 50);
    } else {
      subtitleOpacity.setValue(0);
      subtitleSlide.setValue(4);
    }
  }, [item.state]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleCheckbox = () => {
    if (item.state === 'FOUND') {
      markAsRead(item.id);
    } else if (item.state === 'READ') {
      setBookState(item.id, 'FOUND');
    }
  };

  const renderContent = () => {
    switch (item.state) {
      case 'EMPTY':
      case 'ACTIVE':
        return (
          <View className="flex-1">
            <TextInput
              ref={inputRef}
              className="text-foreground"
              style={{ fontFamily: 'WorkSans_500Medium', fontSize: 17, paddingTop: 8, paddingBottom: 10 }}
              placeholder="Enter book title..."
              placeholderTextColor={theme.muted}
              value={item.originalText}
              onChangeText={(text) => updateBookText(item.id, text)}
              onSubmitEditing={() => lookupBook(item.id)}
              returnKeyType="done"
            />
          </View>
        );

      case 'UNSEARCHED':
        return (
          <View className="flex-1">
            <Text className="text-base text-foreground">
              {item.originalText}
            </Text>
            <Animated.View style={{ opacity: subtitleOpacity, transform: [{ translateY: subtitleSlide }] }}>
              <Text className="text-xs text-subtle mt-0.5">
                Not looked up yet
              </Text>
            </Animated.View>
          </View>
        );

      case 'SEARCHING':
        return (
          <View className="flex-1">
            <Text className="text-base text-muted">
              {item.originalText}
            </Text>
            <Text className="text-xs text-subtle mt-0.5">
              Searching...
            </Text>
          </View>
        );

      case 'FOUND':
        return (
          <Pressable className="flex-1" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text className="text-base text-foreground font-medium">
              {item.resolvedTitle}
            </Text>
            <Text className="text-sm text-muted mt-0.5">
              {item.resolvedAuthor}
            </Text>
          </Pressable>
        );

      case 'OPTIONS_FOUND':
        return (
          <Pressable className="flex-1" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text className="text-base text-foreground">
              {item.originalText}
            </Text>
            <Text className="text-sm text-primary mt-0.5">
              Multiple matches found · Tap to choose
            </Text>
          </Pressable>
        );

      case 'NOT_FOUND':
        return (
          <Pressable className="flex-1" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text className="text-base text-foreground">
              {item.originalText}
            </Text>
            <Text className="text-sm text-danger mt-0.5">
              No matches found · Tap to retry
            </Text>
          </Pressable>
        );

      case 'READ':
        return (
          <Pressable className="flex-1" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text className="text-base text-foreground line-through">
              {item.resolvedTitle}
            </Text>
            <Text className="text-sm text-subtle mt-0.5">
              {item.resolvedAuthor}
            </Text>
          </Pressable>
        );

      default:
        return null;
    }
  };

  const showCheckbox = item.state === 'FOUND' || item.state === 'READ';
  const showQuestion = item.state === 'OPTIONS_FOUND';
  const showNotFound = item.state === 'NOT_FOUND';
  const showPlus = item.state === 'EMPTY' || item.state === 'ACTIVE';
  const showArrow = item.state === 'UNSEARCHED';
  const showLoader = item.state === 'SEARCHING';

  const iconColor = theme.subtle;

  return (
    <View className="flex-row items-center px-4 py-1.5">
      {showPlus && (
        <View className="w-7 h-7 mr-3 items-center justify-center">
          <Plus size={22} color={iconColor} />
        </View>
      )}
      {showArrow && (
        <View className="w-7 h-7 mr-3 items-center justify-center">
          <ArrowDown size={22} color={iconColor} />
        </View>
      )}
      {showLoader && (
        <Animated.View className="w-7 h-7 mr-3 items-center justify-center" style={{ transform: [{ rotate: spin }] }}>
          <Loader2 size={26} color={iconColor} />
        </Animated.View>
      )}
      {showCheckbox && (
        <Pressable onPress={handleCheckbox} onPressIn={onPressIn} onPressOut={onPressOut} className="mr-3">
          <View
            className={`w-7 h-7 rounded-full items-center justify-center ${
              item.state === 'READ' ? 'bg-foreground' : ''
            }`}
            style={item.state !== 'READ' ? { borderWidth: 2.5, borderColor: theme.muted } : undefined}
          >
            {item.state === 'READ' && (
              <Check size={15} color={theme.background} strokeWidth={3} />
            )}
          </View>
        </Pressable>
      )}
      {showQuestion && (
        <View
          className="w-7 h-7 rounded-full mr-3 items-center justify-center"
          style={{ borderWidth: 2.5, borderColor: '#37AE63' }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#37AE63' }}>?</Text>
        </View>
      )}
      {showNotFound && (
        <View
          className="w-7 h-7 rounded-full mr-3 items-center justify-center"
          style={{ borderWidth: 2.5, borderColor: theme.danger }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.danger }}>!</Text>
        </View>
      )}
      {renderContent()}
    </View>
  );
};
