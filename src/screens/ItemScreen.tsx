import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
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
  const { books, selectOption, submitBook, deleteBook, updateBookQuery } = useBooks();
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
      // Update the query in context first
      updateBookQuery(bookId, retryQuery);
      // Then submit
      await submitBook(bookId);
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
      <Text className="text-3xl font-bold text-black mb-2">
        {book.bookData?.title}
      </Text>
      <Text className="text-xl text-gray-600 mb-8">
        by {book.bookData?.author}
      </Text>
      
      <View className="border-t border-gray-200 pt-6">
        <Text className="text-sm text-gray-500 mb-2">Original search</Text>
        <Text className="text-base text-gray-700">{book.query}</Text>
      </View>
    </View>
  );

  const renderOptionsView = () => (
    <View className="flex-1">
      <View className="p-6 border-b border-gray-200">
        <Text className="text-lg font-semibold text-black mb-2">
          Multiple matches found
        </Text>
        <Text className="text-sm text-gray-600">
          Select the book you're looking for:
        </Text>
      </View>
      
      <ScrollView className="flex-1">
        {book.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="p-4 border-b border-gray-100 active:bg-gray-50"
            onPress={() => handleSelectOption(option)}
          >
            <Text className="text-base font-medium text-black">
              {option.title}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {option.author}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderNoOptionsView = () => (
    <View className="flex-1 p-6">
      <Text className="text-lg font-semibold text-black mb-2">
        No matches found
      </Text>
      <Text className="text-sm text-gray-600 mb-6">
        We couldn't find "{book.query}". Try a different search term:
      </Text>

      <TextInput
        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-black text-base mb-4"
        placeholder="Enter a different title..."
        placeholderTextColor="#9CA3AF"
        value={retryQuery}
        onChangeText={setRetryQuery}
        autoFocus
        onSubmitEditing={handleRetrySearch}
        returnKeyType="search"
      />

      <TouchableOpacity
        className="bg-black rounded-lg py-3 items-center"
        onPress={handleRetrySearch}
      >
        <Text className="text-white text-base font-medium">Search Again</Text>
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
      case 'NO_OPTIONS_FOUND':
        return renderNoOptionsView();
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-white border-b border-gray-200 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-blue-600">← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
          <Text className="text-base text-red-600">Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 mx-8 w-80">
            <Text className="text-lg font-semibold text-black mb-2">
              Delete this book?
            </Text>
            <Text className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </Text>
            
            <TouchableOpacity
              className="bg-red-600 rounded-lg py-3 items-center mb-3"
              onPress={handleDelete}
            >
              <Text className="text-white text-base font-medium">Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-100 rounded-lg py-3 items-center"
              onPress={() => setShowDeleteModal(false)}
            >
              <Text className="text-black text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
