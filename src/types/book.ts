export type BookState = 
  | 'EMPTY'
  | 'ACTIVE'
  | 'UNSEARCHED'
  | 'SEARCHING'
  | 'FOUND'
  | 'OPTIONS_FOUND'
  | 'NOT_FOUND'
  | 'READ';

export type BookData = {
  title: string;
  author: string;
};

export type BookItem = {
  id: string;
  state: BookState;
  originalText: string;
  resolvedTitle?: string;
  resolvedAuthor?: string;
  options?: BookData[];
};

export type LookupResult = 
  | { type: 'single'; book: BookData }
  | { type: 'multi'; options: BookData[] }
  | { type: 'none' };
