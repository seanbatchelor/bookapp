import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal } from 'react-native';
import { useBooks } from '../context/BooksContext';
import { BookData } from '../types/book';
import { X } from 'lucide-react-native';
import { theme } from '../theme/colors';

type ItemSheetProps = {
  bookId: string;
  onClose: () => void;
};

export function ItemSheet({ bookId, onClose }: ItemSheetProps) {
  const { books, selectOption, lookupBook, deleteBook, updateBookText } = useBooks();
  const [retryQuery, setRetryQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const book = books.find(b => b.id === bookId);

  if (!book) return null;

  const handleSelectOption = (option: BookData) => {
    selectOption(bookId, option);
  };

  const handleRetrySearch = async () => {
    if (retryQuery.trim()) {
      updateBookText(bookId, retryQuery);
      await lookupBook(bookId);
      onClose();
    }
  };

  const handleDelete = () => {
    deleteBook(bookId);
    setShowDeleteModal(false);
    onClose();
  };

  const headerTitle = () => {
    switch (book.state) {
      case 'FOUND':
        return 'To Read';
      case 'READ':
        return 'Read';
      case 'OPTIONS_FOUND':
        return book.originalText;
      case 'NOT_FOUND':
        return book.originalText;
      default:
        return '';
    }
  };

  const headerSubtitle = () => {
    switch (book.state) {
      case 'OPTIONS_FOUND':
        return 'Multiple matches found · Select one below';
      case 'NOT_FOUND':
        return 'No matches found · Try a different search';
      default:
        return '';
    }
  };

  const renderFoundView = () => (
    <View style={{ flex: 1, paddingHorizontal: 24 }}>
      {/* Book cover */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', width: '85%', aspectRatio: 0.65 }}>
          {/* Spine */}
          <View style={{
            width: 18,
            backgroundColor: theme.foreground,
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }} />
          {/* Cover */}
          <View style={{
            flex: 1,
            borderTopWidth: 2,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: theme.foreground,
            padding: 20,
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: theme.foreground, lineHeight: 28 }}>
              {book.resolvedTitle}
            </Text>
            <Text style={{ fontSize: 14, color: theme.muted }}>
              by {book.resolvedAuthor}
            </Text>
          </View>
        </View>
      </View>

      {/* Delete */}
      <View style={{ paddingBottom: 32 }}>
        <Pressable onPress={() => setShowDeleteModal(true)}>
          <Text className="text-base text-danger">Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderOptionsView = () => (
    <ScrollView className="flex-1">
      {book.options?.map((option, index) => (
        <Pressable
          key={index}
          className="px-6 py-4 border-b border-border"
          onPress={() => handleSelectOption(option)}
        >
          <Text className="text-base font-medium text-foreground">
            {option.title}
          </Text>
          <Text className="text-sm text-muted mt-0.5">
            {option.author}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  const renderNoOptionsView = () => (
    <View className="flex-1 px-6 pt-4">
      <TextInput
        className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-base mb-4"
        placeholder="Enter a different title..."
        placeholderTextColor="#166534"
        value={retryQuery}
        onChangeText={setRetryQuery}
        autoFocus
        onSubmitEditing={handleRetrySearch}
        returnKeyType="search"
      />

      <Pressable
        className="bg-foreground rounded-lg py-3 items-center"
        onPress={handleRetrySearch}
      >
        <Text className="text-background text-base font-medium">Search Again</Text>
      </Pressable>
    </View>
  );

  const renderContent = () => {
    switch (book.state) {
      case 'FOUND':
      case 'READ':
        return renderFoundView();
      case 'OPTIONS_FOUND':
        return renderOptionsView();
      case 'NOT_FOUND':
        return renderNoOptionsView();
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-start justify-between px-6 pt-6 pb-4">
        <View className="flex-1 pr-4">
          <Text className="text-xl font-semibold text-foreground" numberOfLines={2}>
            {headerTitle()}
          </Text>
          {!!headerSubtitle() && (
            <Text className="text-sm text-muted mt-1" numberOfLines={2}>
              {headerSubtitle()}
            </Text>
          )}
        </View>
        <Pressable onPress={onClose} hitSlop={12}>
          <X size={22} color={theme.muted} />
        </Pressable>
      </View>

      {renderContent()}

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-surface rounded-2xl p-6 mx-8 w-80">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Delete this book?
            </Text>
            <Text className="text-sm text-muted mb-6">
              This action cannot be undone.
            </Text>

            <Pressable
              className="bg-danger rounded-lg py-3 items-center mb-3"
              onPress={handleDelete}
            >
              <Text className="text-danger-surface text-base font-medium">Delete</Text>
            </Pressable>

            <Pressable
              className="bg-neutral-surface rounded-lg py-3 items-center"
              onPress={() => setShowDeleteModal(false)}
            >
              <Text className="text-neutral text-base">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
