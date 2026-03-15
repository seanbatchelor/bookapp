import React, { useMemo, useCallback, useState } from 'react';
import { View, FlatList, Pressable, Modal } from 'react-native';
import { Text } from '../components/Text';
import { DitherFade } from '../components/ui/DitherFade';
import { DitherCircle } from '../components/ui/DitherCircle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooks } from '../context/BooksContext';
import { SwipeableBookItem } from '../components/SwipeableBookItem';
import { ItemSheet } from '../components/ItemSheet';
import { BookItem } from '../types/book';

export default function HomeScreen() {
  const { books, addBook } = useBooks();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const { unreadBooks, readBooks } = useMemo(() => {
    const unread = books.filter(b => b.state !== 'READ');
    const read = books.filter(b => b.state === 'READ');
    return { unreadBooks: unread, readBooks: read };
  }, [books]);

  const handleItemPress = useCallback((item: BookItem) => {
    if (
      item.state === 'FOUND' ||
      item.state === 'READ' ||
      item.state === 'OPTIONS_FOUND' ||
      item.state === 'NOT_FOUND'
    ) {
      setSelectedBookId(item.id);
    }
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedBookId(null);
  }, []);

  const sections = useMemo(() => {
    const result: Array<{ type: 'header' | 'item' | 'dither-fade'; data: any }> = [];
    if (unreadBooks.length > 0) {
      result.push({ type: 'header', data: 'To Read' });
      unreadBooks.forEach(book => result.push({ type: 'item', data: book }));
    }
    if (readBooks.length > 0) {
      result.push({ type: 'dither-fade', data: null });
      result.push({ type: 'header', data: 'Read' });
      readBooks.forEach(book => result.push({ type: 'item', data: book }));
    }
    return result;
  }, [unreadBooks, readBooks]);

  const renderItem = useCallback(({ item }: { item: { type: 'header' | 'item' | 'dither-fade'; data: any } }) => {
    if (item.type === 'header') {
      return (
        <View
          className="px-4 py-2"
          style={item.data === 'Read' ? { zIndex: 1 } : undefined}
        >
          <Text className="text-sm text-muted">
            {item.data}
          </Text>
        </View>
      );
    }
    if (item.type === 'dither-fade') {
      return (
        <View style={{ marginTop: 12, marginBottom: -20, borderTopWidth: 1, borderTopColor: '#5EC986' }}>
          <DitherFade direction="up" />
        </View>
      );
    }
    return <SwipeableBookItem item={item.data} onPress={() => handleItemPress(item.data)} />;
  }, [handleItemPress]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item.type === 'header' ? `header-${item.data}` : item.type === 'dither-fade' ? 'dither-fade-read' : `item-${item.data.id}`
        }
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-muted text-center text-base">
              No books yet.{'\n'}Tap + to add your first book.
            </Text>
          </View>
        }
      />

      <View style={{ position: 'absolute', bottom: 32, right: 32 }}>
        <View style={{ position: 'absolute', top: 3, left: 2 }}>
          <DitherCircle size={53} />
        </View>
        <Pressable
          className="w-14 h-14 rounded-full items-center justify-center"
          style={{ backgroundColor: '#298E4E' }}
          onPress={addBook}
        >
          <Text className="text-background text-3xl">+</Text>
        </Pressable>
      </View>

      <Modal
        visible={!!selectedBookId}
        presentationStyle="formSheet"
        animationType="slide"
        onRequestClose={handleCloseSheet}
      >
        {selectedBookId && (
          <ItemSheet bookId={selectedBookId} onClose={handleCloseSheet} />
        )}
      </Modal>
    </SafeAreaView>
  );
}
