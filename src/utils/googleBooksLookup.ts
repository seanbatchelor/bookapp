import { LookupResult } from '../types/book';

export async function googleBooksLookup(query: string): Promise<LookupResult> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=5&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) return { type: 'none' };

    const data = await response.json();

    if (!data.items || data.items.length === 0) return { type: 'none' };

    const books = data.items.map((item: any) => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] ?? 'Unknown Author',
    }));

    if (books.length === 1) {
      return { type: 'single', book: books[0] };
    }

    return { type: 'multi', options: books };
  } catch {
    return { type: 'none' };
  }
}
