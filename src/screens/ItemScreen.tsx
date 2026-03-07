import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useBooks } from '../context/BooksContext';
import { BookData } from '../types/book';

type ItemScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Item'>;
  route: RouteProp<RootStackParamList, 'Item'>;
};

export default function ItemScreen({ navigation, route }: ItemScreenProps) {
  const { bookId } = route.params;
  const { books, selectOption, lookupBook, deleteBook, updateBookText } = useBooks();
  const [retryQuery, setRetryQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const book = books.find(b => b.id === bookId);

  if (!book) {
    navigation.goBack();
    return null;
  }

  const handleSelectOption = (option: BookData) => {
    selectOption(bookId, option);
    navigation.goBack();
  };

  const handleRetrySearch = async () => {
    if (retryQuery.trim()) {
      updateBookText(bookId, retryQuery);
      await lookupBook(bookId);
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    deleteBook(bookId);
    setShowDeleteModal(false);
    navigation.goBack();
  };

  const renderFoundView = () => (
    <View className="flex-1 p-6">
      <Text className="text-3xl font-bold text-foreground mb-2">
        {book.resolvedTitle}
      </Text>
      <Text className="text-xl text-muted mb-8">
        by {book.resolvedAuthor}
      </Text>
      
      <View className="border-t border-border pt-6">
        <Text className="text-sm text-subtle mb-2">Original search</Text>
        <Text className="text-base text-muted">{book.originalText}</Text>
      </View>
    </View>
  );

  const renderOptionsView = () => (
    <View className="flex-1">
      <View className="p-6 border-b border-border">
        <Text className="text-lg font-semibold text-foreground mb-2">
          Multiple matches found
        </Text>
        <Text className="text-sm text-muted">
          Select the book you're looking for:
        </Text>
      </View>
      
      <ScrollView className="flex-1">
        {book.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="p-4 border-b border-border"
            onPress={() => handleSelectOption(option)}
          >
            <Text className="text-base font-medium text-foreground">
              {option.title}
            </Text>
            <Text className="text-sm text-muted mt-1">
              {option.author}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderNoOptionsView = () => (
    <View className="flex-1 p-6">
      <Text className="text-lg font-semibold text-foreground mb-2">
        No matches found
      </Text>
      <Text className="text-sm text-muted mb-6">
        We couldn't find "{book.originalText}". Try a different search term:
      </Text>

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

      <TouchableOpacity
        className="bg-foreground rounded-lg py-3 items-center"
        onPress={handleRetrySearch}
      >
        <Text className="text-background text-base font-medium">Search Again</Text>
      </TouchableOpacity>
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
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="pb-4 px-6 bg-background flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-foreground">← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
          <Text className="text-base text-danger">Delete</Text>
        </TouchableOpacity>
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
            
            <TouchableOpacity
              className="bg-danger rounded-lg py-3 items-center mb-3"
              onPress={handleDelete}
            >
              <Text className="text-danger-surface text-base font-medium">Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-neutral-surface rounded-lg py-3 items-center"
              onPress={() => setShowDeleteModal(false)}
            >
              <Text className="text-neutral text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
