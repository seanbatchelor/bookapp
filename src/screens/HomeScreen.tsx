import React, { useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, ActivityIndicator, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useBooks } from '../context/BooksContext';
import { SwipeableBookItem } from '../components/SwipeableBookItem';
import { BookItem } from '../types/book';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const PULL_THRESHOLD = 80;
const TRIGGER_THRESHOLD = 120;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { books, addBook, lookupAllUnsearched } = useBooks();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Separate and order books: unread first, then read
  const { unreadBooks, readBooks, unsearchedCount } = useMemo(() => {
    const unread = books.filter(b => b.state !== 'READ');
    const read = books.filter(b => b.state === 'READ');
    const unsearched = books.filter(b => b.state === 'UNSEARCHED').length;
    return { unreadBooks: unread, readBooks: read, unsearchedCount: unsearched };
  }, [books]);

  const handleRefresh = async () => {
    if (unsearchedCount === 0) return;
    
    setIsRefreshing(true);
    await lookupAllUnsearched();
    setIsRefreshing(false);
  };

  const handleItemPress = (item: BookItem) => {
    // Only navigate for certain states
    if (
      item.state === 'FOUND' || 
      item.state === 'OPTIONS_FOUND' || 
      item.state === 'NOT_FOUND'
    ) {
      navigation.navigate('Item', { bookId: item.id });
    }
  };

  // Create sections for SectionList-like behavior
  const sections = useMemo(() => {
    const result: Array<{ type: 'header' | 'item'; data: any }> = [];
    
    if (unreadBooks.length > 0) {
      result.push({ type: 'header', data: 'To Read' });
      unreadBooks.forEach(book => result.push({ type: 'item', data: book }));
    }
    
    if (readBooks.length > 0) {
      result.push({ type: 'header', data: 'Read' });
      readBooks.forEach(book => result.push({ type: 'item', data: book }));
    }
    
    return result;
  }, [unreadBooks, readBooks]);

  const renderItem = ({ item }: { item: { type: 'header' | 'item'; data: any } }) => {
    if (item.type === 'header') {
      return (
        <View className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {item.data}
          </Text>
        </View>
      );
    }
    return <SwipeableBookItem item={item.data} onPress={() => handleItemPress(item.data)} />;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-white border-b border-gray-200">
        <Text className="text-black text-2xl font-bold">Reading List</Text>
        {unsearchedCount > 0 && !isRefreshing && (
          <Text className="text-xs text-gray-500 mt-1">
            {unsearchedCount} item{unsearchedCount !== 1 ? 's' : ''} not looked up · Pull to search
          </Text>
        )}
      </View>

      {/* Book List */}
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => 
          item.type === 'header' ? `header-${item.data}` : `item-${item.data.id}`
        }
        refreshControl={
          unsearchedCount > 0 ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
              title={`Look up ${unsearchedCount} item${unsearchedCount !== 1 ? 's' : ''}`}
              titleColor="#3B82F6"
            />
          ) : undefined
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-gray-400 text-center text-base">
              No books yet.{'\n'}Tap + to add your first book.
            </Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-8 bg-black w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={addBook}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}
