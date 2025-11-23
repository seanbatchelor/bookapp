import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookItem, BookData } from '../types/book';
import { mockLookup } from '../utils/mockLookup';

type BooksContextType = {
  books: BookItem[];
  addBook: () => void;
  updateBookQuery: (id: string, query: string) => void;
  submitBook: (id: string) => Promise<void>;
  selectOption: (id: string, book: BookData) => void;
  markAsRead: (id: string) => void;
  deleteBook: (id: string) => void;
  setBookState: (id: string, state: BookItem['state']) => void;
};

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<BookItem[]>([]);

  const addBook = () => {
    const newBook: BookItem = {
      id: Date.now().toString(),
      state: 'EMPTY',
      query: '',
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const updateBookQuery = (id: string, query: string) => {
    setBooks(prev => prev.map(book => 
      book.id === id 
        ? { ...book, query, state: query ? 'ACTIVE' : 'EMPTY' }
        : book
    ));
  };

  const submitBook = async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book || !book.query.trim()) return;

    // Set to SUBMITTED then SEARCHING
    setBooks(prev => prev.map(b => 
      b.id === id ? { ...b, state: 'SUBMITTED' } : b
    ));

    setTimeout(() => {
      setBooks(prev => prev.map(b => 
        b.id === id ? { ...b, state: 'SEARCHING' } : b
      ));
    }, 100);

    // Perform lookup
    const result = await mockLookup(book.query);

    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b;

      if (result.type === 'single') {
        return { ...b, state: 'FOUND', bookData: result.book };
      } else if (result.type === 'multi') {
        return { ...b, state: 'OPTIONS_FOUND', options: result.options };
      } else {
        return { ...b, state: 'NO_OPTIONS_FOUND' };
      }
    }));
  };

  const selectOption = (id: string, book: BookData) => {
    setBooks(prev => prev.map(b => 
      b.id === id 
        ? { ...b, state: 'FOUND', bookData: book, options: undefined }
        : b
    ));
  };

  const markAsRead = (id: string) => {
    setBooks(prev => prev.map(b => 
      b.id === id ? { ...b, state: 'READ' } : b
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const setBookState = (id: string, state: BookItem['state']) => {
    setBooks(prev => prev.map(b => 
      b.id === id ? { ...b, state } : b
    ));
  };

  return (
    <BooksContext.Provider value={{
      books,
      addBook,
      updateBookQuery,
      submitBook,
      selectOption,
      markAsRead,
      deleteBook,
      setBookState,
    }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within BooksProvider');
  }
  return context;
};
