import React, { useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    if (
      item.state === 'FOUND' || 
      item.state === 'OPTIONS_FOUND' || 
      item.state === 'NOT_FOUND'
    ) {
      navigation.navigate('Item', { bookId: item.id });
    }
  };

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
        <View className="px-4 py-2">
          <Text className="text-sm text-muted">
            {item.data}
          </Text>
        </View>
      );
    }
    return <SwipeableBookItem item={item.data} onPress={() => handleItemPress(item.data)} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => 
          item.type === 'header' ? `header-${item.data}` : `item-${item.data.id}`
        }
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          unsearchedCount > 0 ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#052e16"
              title={`Look up ${unsearchedCount} item${unsearchedCount !== 1 ? 's' : ''}`}
              titleColor="#052e16"
            />
          ) : undefined
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-muted text-center text-base">
              No books yet.{'\n'}Tap + to add your first book.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        className="absolute bottom-8 right-8 bg-foreground w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={addBook}
      >
        <Text className="text-background text-3xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
