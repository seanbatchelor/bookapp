import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Book } from './LibraryScreen';

type AddBookScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddBook'>;
};

const STORAGE_KEY = '@book_list';

export default function AddBookScreen({ navigation }: AddBookScreenProps) {
  const [bookTitle, setBookTitle] = useState('');

  const handleSave = async () => {
    if (bookTitle.trim() === '') {
      console.log('Book title is empty');
      return;
    }

    console.log('New book title:', bookTitle);

    try {
      // Load existing books
      const storedBooks = await AsyncStorage.getItem(STORAGE_KEY);
      const books: Book[] = storedBooks ? JSON.parse(storedBooks) : [];

      // Add new book
      const newBook: Book = {
        id: Date.now().toString(),
        title: bookTitle.trim(),
      };
      books.push(newBook);

      // Save back to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      console.log('Book saved successfully!');

      // Navigate back to Library
      navigation.goBack();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Add New Book</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Book Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter book title"
          placeholderTextColor="#9CA3AF"
          value={bookTitle}
          onChangeText={setBookTitle}
          autoFocus
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    color: '#000',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#000',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
