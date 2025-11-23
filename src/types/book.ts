export type BookState = 
  | 'EMPTY'
  | 'ACTIVE'
  | 'SUBMITTED'
  | 'SEARCHING'
  | 'FOUND'
  | 'OPTIONS_FOUND'
  | 'NO_OPTIONS_FOUND'
  | 'READ';

export type BookData = {
  title: string;
  author: string;
};

export type BookItem = {
  id: string;
  state: BookState;
  query: string;
  bookData?: BookData;
  options?: BookData[];
};

export type LookupResult = 
  | { type: 'single'; book: BookData }
  | { type: 'multi'; options: BookData[] }
  | { type: 'none' };
