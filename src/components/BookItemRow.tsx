import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Plus, Check, ArrowDown, Loader2 } from 'lucide-react-native';
import { BookItem } from '../types/book';
import { useBooks } from '../context/BooksContext';
import { theme } from '../theme/colors';

type BookItemRowProps = {
  item: BookItem;
  onPress: () => void;
};

export const BookItemRow = ({ item, onPress }: BookItemRowProps) => {
  const { updateBookText, saveBook, markAsRead, setBookState } = useBooks();
  const inputRef = useRef<TextInput>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

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
              className="text-base text-foreground py-2"
              placeholder="Enter book title..."
              placeholderTextColor={theme.muted}
              value={item.originalText}
              onChangeText={(text) => updateBookText(item.id, text)}
              onSubmitEditing={() => saveBook(item.id)}
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
            <Text className="text-xs text-subtle mt-0.5">
              Not looked up yet
            </Text>
          </View>
        );

      case 'SEARCHING':
        return (
          <View className="flex-1">
            <Text className="text-base text-muted">
              {item.originalText}
            </Text>
          </View>
        );

      case 'FOUND':
        return (
          <TouchableOpacity className="flex-1" onPress={onPress}>
            <Text className="text-base text-foreground font-medium">
              {item.resolvedTitle}
            </Text>
            <Text className="text-sm text-muted mt-0.5">
              {item.resolvedAuthor}
            </Text>
          </TouchableOpacity>
        );

      case 'OPTIONS_FOUND':
        return (
          <TouchableOpacity className="flex-1" onPress={onPress}>
            <Text className="text-base text-foreground">
              {item.originalText}
            </Text>
            <Text className="text-sm text-amber-600 mt-0.5">
              Multiple matches found · Tap to choose
            </Text>
          </TouchableOpacity>
        );

      case 'NOT_FOUND':
        return (
          <TouchableOpacity className="flex-1" onPress={onPress}>
            <Text className="text-base text-foreground">
              {item.originalText}
            </Text>
            <Text className="text-sm text-danger mt-0.5">
              No matches found · Tap to retry
            </Text>
          </TouchableOpacity>
        );

      case 'READ':
        return (
          <View className="flex-1">
            <Text className="text-base text-foreground line-through">
              {item.resolvedTitle}
            </Text>
            <Text className="text-sm text-subtle mt-0.5">
              {item.resolvedAuthor}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const showCheckbox = item.state === 'FOUND' || item.state === 'READ';
  const showQuestion = item.state === 'OPTIONS_FOUND';
  const showPlus = item.state === 'EMPTY' || item.state === 'ACTIVE';
  const showArrow = item.state === 'UNSEARCHED';
  const showLoader = item.state === 'SEARCHING';

  const iconColor = theme.subtle;
  const iconColorActive = theme.foreground;

  return (
    <View className="flex-row items-center px-4 py-1.5">
      {showPlus && (
        <View className="mr-3">
          <Plus size={20} color={iconColor} />
        </View>
      )}
      {showArrow && (
        <View className="mr-3">
          <ArrowDown size={20} color={iconColor} />
        </View>
      )}
      {showLoader && (
        <Animated.View className="mr-3" style={{ transform: [{ rotate: spin }] }}>
          <Loader2 size={20} color={iconColor} />
        </Animated.View>
      )}
      {showCheckbox && (
        <TouchableOpacity onPress={handleCheckbox} className="mr-3">
          <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            item.state === 'READ'
              ? 'bg-foreground border-foreground'
              : 'border-muted'
          }`}>
            {item.state === 'READ' && (
              <Check size={12} color={theme.background} strokeWidth={3} />
            )}
          </View>
        </TouchableOpacity>
      )}
      {showQuestion && (
        <View className="w-5 h-5 mr-3 items-center justify-center">
          <Text className="text-amber-600 text-base">?</Text>
        </View>
      )}
      {renderContent()}
    </View>
  );
};
