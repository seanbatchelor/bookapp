import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BookItem } from '../types/book';
import { useBooks } from '../context/BooksContext';

type BookItemRowProps = {
  item: BookItem;
  onPress: () => void;
};

export const BookItemRow = ({ item, onPress }: BookItemRowProps) => {
  const { updateBookQuery, submitBook, markAsRead } = useBooks();
  const inputRef = useRef<TextInput>(null);

  // Auto-focus when EMPTY
  useEffect(() => {
    if (item.state === 'EMPTY') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [item.state]);

  const handleCheckbox = () => {
    if (item.state === 'FOUND') {
      markAsRead(item.id);
    } else if (item.state === 'READ') {
      // Optionally unmark as read
      // For now, do nothing as per requirements
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
              className="text-base text-black py-2"
              placeholder="Enter book title..."
              placeholderTextColor="#9CA3AF"
              value={item.query}
              onChangeText={(text) => updateBookQuery(item.id, text)}
              onSubmitEditing={() => submitBook(item.id)}
              returnKeyType="search"
            />
          </View>
        );

      case 'SUBMITTED':
      case 'SEARCHING':
        return (
          <View className="flex-1 flex-row items-center">
            <ActivityIndicator size="small" color="#000" />
            <Text className="ml-3 text-base text-gray-600">
              Searching for "{item.query}"...
            </Text>
          </View>
        );

      case 'FOUND':
        return (
          <TouchableOpacity className="flex-1" onPress={onPress}>
            <Text className="text-base text-black font-medium">
              {item.bookData?.title}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {item.bookData?.author}
            </Text>
          </TouchableOpacity>
        );

      case 'OPTIONS_FOUND':
        return (
          <TouchableOpacity className="flex-1" onPress={onPress}>
            <Text className="text-base text-black">
              {item.query}
            </Text>
            <Text className="text-sm text-amber-600 mt-1">
              Multiple matches found · Tap to choose
            </Text>
          </TouchableOpacity>
        );

      case 'NO_OPTIONS_FOUND':
        return (
          <TouchableOpacity className="flex-1" onPress={onPress}>
            <Text className="text-base text-black">
              {item.query}
            </Text>
            <Text className="text-sm text-red-600 mt-1">
              No matches found · Tap to retry
            </Text>
          </TouchableOpacity>
        );

      case 'READ':
        return (
          <View className="flex-1">
            <Text className="text-base text-gray-500 line-through">
              {item.bookData?.title}
            </Text>
            <Text className="text-sm text-gray-400 mt-1">
              {item.bookData?.author}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const showCheckbox = item.state === 'FOUND' || item.state === 'READ';

  return (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
      {showCheckbox && (
        <TouchableOpacity 
          onPress={handleCheckbox}
          className="mr-3"
        >
          <View className={`w-5 h-5 rounded border-2 items-center justify-center ${
            item.state === 'READ' 
              ? 'bg-black border-black' 
              : 'border-gray-400'
          }`}>
            {item.state === 'READ' && (
              <Text className="text-white text-xs font-bold">✓</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
      {renderContent()}
    </View>
  );
};
