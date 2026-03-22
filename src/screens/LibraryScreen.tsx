import React, { useMemo, useRef, useState, useCallback } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { AlphabetScrubber } from '../components/AlphabetScrubber';
import { useBooks } from '../context/BooksContext';
import { BookItem } from '../types/book';
import { theme, green } from '../theme/colors';

type Tab = 'Books' | 'Authors';

// ─── Data helpers ─────────────────────────────────────────────────────────────

type BookRow   = { type: 'book-item';     book: BookItem; key: string };
type AuthorRow = { type: 'author-item';   author: string; key: string };
type HeaderRow = { type: 'letter-header'; letter: string; key: string };

type SectionRow = BookRow | AuthorRow | HeaderRow;

function buildBookSections(books: BookItem[]): {
  sections: SectionRow[];
  letterIndexMap: Record<string, number>;
} {
  const resolved = books
    .filter(b => (b.state === 'FOUND' || b.state === 'READ') && b.resolvedTitle)
    .slice()
    .sort((a, b) =>
      (a.resolvedTitle ?? '').localeCompare(b.resolvedTitle ?? '', undefined, { sensitivity: 'base' })
    );

  const sections: SectionRow[] = [];
  const letterIndexMap: Record<string, number> = {};
  let lastLetter = '';

  for (const book of resolved) {
    const letter = (book.resolvedTitle ?? '').charAt(0).toUpperCase();
    if (letter !== lastLetter) {
      letterIndexMap[letter] = sections.length;
      sections.push({ type: 'letter-header', letter, key: `header-${letter}` });
      lastLetter = letter;
    }
    sections.push({ type: 'book-item', book, key: `book-${book.id}` });
  }

  return { sections, letterIndexMap };
}

function buildAuthorSections(books: BookItem[]): {
  sections: SectionRow[];
  letterIndexMap: Record<string, number>;
} {
  const authors = [
    ...new Set(
      books
        .filter(b => (b.state === 'FOUND' || b.state === 'READ') && b.resolvedAuthor)
        .map(b => b.resolvedAuthor as string)
    ),
  ].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  const sections: SectionRow[] = [];
  const letterIndexMap: Record<string, number> = {};
  let lastLetter = '';

  for (const author of authors) {
    const letter = author.charAt(0).toUpperCase();
    if (letter !== lastLetter) {
      letterIndexMap[letter] = sections.length;
      sections.push({ type: 'letter-header', letter, key: `header-${letter}` });
      lastLetter = letter;
    }
    sections.push({ type: 'author-item', author, key: `author-${author}` });
  }

  return { sections, letterIndexMap };
}

// ─── Row components ───────────────────────────────────────────────────────────

function LetterHeader({ letter }: { letter: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 4,
        backgroundColor: theme.background,
      }}
    >
      <Text
        className="font-semibold"
        style={{ fontSize: 13, color: green[700], letterSpacing: 0.5 }}
      >
        {letter}
      </Text>
    </View>
  );
}

function BookRow({ book }: { book: BookItem }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <Text
        className="font-medium"
        style={{ fontSize: 17, color: theme.foreground, lineHeight: 22 }}
      >
        {book.resolvedTitle}
      </Text>
      {book.resolvedAuthor ? (
        <Text
          className="font-regular"
          style={{ fontSize: 14, color: theme.subtle, marginTop: 2 }}
        >
          {book.resolvedAuthor}
        </Text>
      ) : null}
    </View>
  );
}

function AuthorRow({ author }: { author: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <Text
        className="font-medium"
        style={{ fontSize: 17, color: theme.foreground, lineHeight: 22 }}
      >
        {author}
      </Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { books } = useBooks();
  const [activeTab, setActiveTab] = useState<Tab>('Books');
  const listRef = useRef<FlatList<SectionRow>>(null);

  const { sections, letterIndexMap } = useMemo(() => {
    if (activeTab === 'Books') return buildBookSections(books);
    return buildAuthorSections(books);
  }, [books, activeTab]);

  const renderItem = useCallback(({ item }: { item: SectionRow }) => {
    if (item.type === 'letter-header') return <LetterHeader letter={item.letter} />;
    if (item.type === 'book-item')     return <BookRow book={item.book} />;
    if (item.type === 'author-item')   return <AuthorRow author={item.author} />;
    return null;
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const listPaddingBottom = insets.bottom + 72;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background">
      {/* Tab bar */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.background,
        }}
      >
        {(['Books', 'Authors'] as Tab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => handleTabChange(tab)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 14,
                borderBottomWidth: 2,
                borderBottomColor: isActive ? theme.primaryDark : 'transparent',
              }}
            >
              <Text
                className={isActive ? 'font-semibold' : 'font-medium'}
                style={{
                  fontSize: 15,
                  color: isActive ? green[900] : theme.subtle,
                }}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List + scrubber */}
      <View style={{ flex: 1, position: 'relative' }}>
        <FlatList
          ref={listRef}
          style={{ flex: 1 }}
          data={sections}
          removeClippedSubviews={false}
          initialNumToRender={24}
          maxToRenderPerBatch={16}
          windowSize={11}
          {...(Platform.OS === 'ios'
            ? { contentInsetAdjustmentBehavior: 'never' as const }
            : {})}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingRight: 32, flexGrow: 1, paddingBottom: listPaddingBottom }}
          onScrollToIndexFailed={(info) => {
            // Fall back to offset-based scroll if index isn't measured yet
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false,
            });
          }}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 64 }}>
              <Text className="text-muted text-center text-base">
                {activeTab === 'Books'
                  ? 'No books yet.\nAdd some on the List page.'
                  : 'No authors yet.\nAdd books on the List page.'}
              </Text>
            </View>
          }
        />

        <AlphabetScrubber
          listRef={listRef}
          letterIndexMap={letterIndexMap}
          itemCount={sections.length}
        />
      </View>

    </SafeAreaView>
  );
}
