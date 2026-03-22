import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookItem, BookData } from '../types/book';
import { googleBooksLookup } from '../utils/googleBooksLookup';
import { USE_SEED_DATA, SEED_BOOKS } from '../data/seedData';

type BooksContextType = {
  books: BookItem[];
  addBook: () => void;
  updateBookText: (id: string, text: string) => void;
  saveBook: (id: string) => void;
  lookupBook: (id: string) => Promise<void>;
  lookupAllUnsearched: () => Promise<void>;
  selectOption: (id: string, book: BookData) => void;
  markAsRead: (id: string) => void;
  deleteBook: (id: string) => void;
  setBookState: (id: string, state: BookItem['state']) => void;
};

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<BookItem[]>(USE_SEED_DATA ? SEED_BOOKS : []);

  const addBook = () => {
    const ts = Date.now();
    const newBook: BookItem = {
      id: ts.toString(),
      state: 'EMPTY',
      originalText: '',
      sortOrder: ts,
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const updateBookText = (id: string, text: string) => {
    setBooks(prev => prev.map(book => 
      book.id === id 
        ? { ...book, originalText: text, state: text ? 'ACTIVE' : 'EMPTY' }
        : book
    ));
  };

  const saveBook = (id: string) => {
    setBooks(prev => prev.map(b => 
      b.id === id && b.originalText.trim()
        ? { ...b, state: 'UNSEARCHED' }
        : b
    ));
  };

  const lookupBook = async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book || !book.originalText.trim()) return;

    // Set to SEARCHING
    setBooks(prev => prev.map(b => 
      b.id === id ? { ...b, state: 'SEARCHING' } : b
    ));

    // Perform lookup
    const result = await googleBooksLookup(book.originalText);

    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b;

      if (result.type === 'single') {
        return { 
          ...b, 
          state: 'FOUND', 
          resolvedTitle: result.book.title,
          resolvedAuthor: result.book.author,
          resolvedYear: result.book.year,
          options: undefined
        };
      } else if (result.type === 'multi') {
        return { ...b, state: 'OPTIONS_FOUND', options: result.options };
      } else {
        return { ...b, state: 'NOT_FOUND' };
      }
    }));
  };

  const lookupAllUnsearched = async () => {
    const unsearchedBooks = books.filter(b => b.state === 'UNSEARCHED');
    
    // Set all to SEARCHING
    setBooks(prev => prev.map(b => 
      b.state === 'UNSEARCHED' ? { ...b, state: 'SEARCHING' } : b
    ));

    // Lookup each book
    for (const book of unsearchedBooks) {
      const result = await googleBooksLookup(book.originalText);
      
      setBooks(prev => prev.map(b => {
        if (b.id !== book.id) return b;

        if (result.type === 'single') {
          return { 
            ...b, 
            state: 'FOUND', 
            resolvedTitle: result.book.title,
            resolvedAuthor: result.book.author,
            resolvedYear: result.book.year,
            options: undefined
          };
        } else if (result.type === 'multi') {
          return { ...b, state: 'OPTIONS_FOUND', options: result.options };
        } else {
          return { ...b, state: 'NOT_FOUND' };
        }
      }));
    }
  };

  const selectOption = (id: string, book: BookData) => {
    setBooks(prev => prev.map(b => 
      b.id === id 
        ? { 
            ...b, 
            state: 'FOUND', 
            resolvedTitle: book.title,
            resolvedAuthor: book.author,
            resolvedYear: book.year,
            options: undefined 
          }
        : b
    ));
  };

  const markAsRead = (id: string) => {
    const ts = Date.now();
    setBooks(prev => prev.map(b => 
      b.id === id ? { ...b, state: 'READ', sortOrder: ts, movedAt: ts } : b
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const setBookState = (id: string, state: BookItem['state']) => {
    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b;
      if (b.state === 'READ' && state === 'FOUND') {
        const unreadSorts = prev
          .filter(x => x.state !== 'READ')
          .map(x => x.sortOrder ?? 0);
        const minUnread =
          unreadSorts.length === 0 ? 0 : Math.min(...unreadSorts);
        return {
          ...b,
          state: 'FOUND',
          sortOrder: minUnread - 1,
          movedAt: Date.now(),
        };
      }
      return { ...b, state };
    }));
  };

  return (
    <BooksContext.Provider value={{
      books,
      addBook,
      updateBookText,
      saveBook,
      lookupBook,
      lookupAllUnsearched,
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
