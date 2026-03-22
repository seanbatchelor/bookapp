import { BookItem } from '../types/book';

// Flip this to false to test the empty state of the app
export const USE_SEED_DATA = true;

export const SEED_BOOKS: BookItem[] = [
  // A
  { id: 's001', state: 'FOUND', originalText: 'Anna Karenina',  resolvedTitle: 'Anna Karenina',  resolvedAuthor: 'Leo Tolstoy',        resolvedYear: '1878' },
  { id: 's002', state: 'FOUND', originalText: 'American Gods',  resolvedTitle: 'American Gods',  resolvedAuthor: 'Neil Gaiman',        resolvedYear: '2001' },
  { id: 's003', state: 'READ',  originalText: 'Atomic Habits',  resolvedTitle: 'Atomic Habits',  resolvedAuthor: 'James Clear',        resolvedYear: '2018' },

  // B
  { id: 's004', state: 'FOUND', originalText: 'Beloved',        resolvedTitle: 'Beloved',        resolvedAuthor: 'Toni Morrison',      resolvedYear: '1987' },
  { id: 's005', state: 'READ',  originalText: 'Brave New World',resolvedTitle: 'Brave New World',resolvedAuthor: 'Aldous Huxley',      resolvedYear: '1932' },

  // C
  { id: 's006', state: 'FOUND', originalText: 'Crime and Punishment',   resolvedTitle: 'Crime and Punishment',   resolvedAuthor: 'Fyodor Dostoevsky', resolvedYear: '1866' },
  { id: 's007', state: 'FOUND', originalText: 'Catch-22',               resolvedTitle: 'Catch-22',               resolvedAuthor: 'Joseph Heller',     resolvedYear: '1961' },

  // D
  { id: 's008', state: 'FOUND', originalText: 'Dune',           resolvedTitle: 'Dune',           resolvedAuthor: 'Frank Herbert',      resolvedYear: '1965' },
  { id: 's009', state: 'READ',  originalText: 'Demon Copperhead',resolvedTitle: 'Demon Copperhead',resolvedAuthor: 'Barbara Kingsolver',resolvedYear: '2022' },

  // E
  { id: 's010', state: 'FOUND', originalText: 'East of Eden',   resolvedTitle: 'East of Eden',   resolvedAuthor: 'John Steinbeck',     resolvedYear: '1952' },
  { id: 's011', state: 'FOUND', originalText: 'Educated',       resolvedTitle: 'Educated',       resolvedAuthor: 'Tara Westover',      resolvedYear: '2018' },

  // F
  { id: 's012', state: 'FOUND', originalText: 'Foundation',          resolvedTitle: 'Foundation',          resolvedAuthor: 'Isaac Asimov',   resolvedYear: '1951' },
  { id: 's013', state: 'READ',  originalText: 'Flowers for Algernon',resolvedTitle: 'Flowers for Algernon',resolvedAuthor: 'Daniel Keyes',   resolvedYear: '1966' },

  // G
  { id: 's014', state: 'FOUND', originalText: 'The Great Gatsby',            resolvedTitle: 'The Great Gatsby',            resolvedAuthor: 'F. Scott Fitzgerald',resolvedYear: '1925' },
  { id: 's015', state: 'FOUND', originalText: "The Girl with the Dragon Tattoo", resolvedTitle: "The Girl with the Dragon Tattoo", resolvedAuthor: 'Stieg Larsson',       resolvedYear: '2005' },

  // H
  { id: 's016', state: 'FOUND', originalText: 'Hamnet',    resolvedTitle: 'Hamnet',    resolvedAuthor: "Maggie O'Farrell",  resolvedYear: '2020' },
  { id: 's017', state: 'READ',  originalText: 'Homegoing', resolvedTitle: 'Homegoing', resolvedAuthor: 'Yaa Gyasi',         resolvedYear: '2016' },

  // I
  { id: 's018', state: 'FOUND', originalText: 'Invisible Man',resolvedTitle: 'Invisible Man',resolvedAuthor: 'Ralph Ellison',  resolvedYear: '1952' },
  { id: 's019', state: 'FOUND', originalText: 'It',           resolvedTitle: 'It',           resolvedAuthor: 'Stephen King',   resolvedYear: '1986' },

  // J
  { id: 's020', state: 'FOUND', originalText: 'Just Kids', resolvedTitle: 'Just Kids', resolvedAuthor: 'Patti Smith', resolvedYear: '2010' },

  // K
  { id: 's021', state: 'FOUND', originalText: 'Kindred',          resolvedTitle: 'Kindred',          resolvedAuthor: 'Octavia E. Butler', resolvedYear: '1979' },
  { id: 's022', state: 'READ',  originalText: 'Klara and the Sun', resolvedTitle: 'Klara and the Sun', resolvedAuthor: 'Kazuo Ishiguro',    resolvedYear: '2021' },

  // L
  { id: 's023', state: 'FOUND', originalText: 'Lolita',                   resolvedTitle: 'Lolita',                   resolvedAuthor: 'Vladimir Nabokov',    resolvedYear: '1955' },
  { id: 's024', state: 'FOUND', originalText: "The Left Hand of Darkness", resolvedTitle: "The Left Hand of Darkness", resolvedAuthor: 'Ursula K. Le Guin',  resolvedYear: '1969' },

  // M
  { id: 's025', state: 'FOUND', originalText: 'Middlemarch',resolvedTitle: 'Middlemarch',resolvedAuthor: 'George Eliot',  resolvedYear: '1871' },
  { id: 's026', state: 'READ',  originalText: 'Mythos',     resolvedTitle: 'Mythos',     resolvedAuthor: 'Stephen Fry',   resolvedYear: '2017' },

  // N
  { id: 's027', state: 'FOUND', originalText: 'Normal People', resolvedTitle: 'Normal People', resolvedAuthor: 'Sally Rooney',    resolvedYear: '2018' },
  { id: 's028', state: 'FOUND', originalText: 'Neuromancer',   resolvedTitle: 'Neuromancer',   resolvedAuthor: 'William Gibson',  resolvedYear: '1984' },

  // O
  { id: 's029', state: 'FOUND', originalText: "On Earth We're Briefly Gorgeous", resolvedTitle: "On Earth We're Briefly Gorgeous", resolvedAuthor: 'Ocean Vuong', resolvedYear: '2019' },

  // P
  { id: 's030', state: 'FOUND', originalText: 'Piranesi',        resolvedTitle: 'Piranesi',        resolvedAuthor: 'Susanna Clarke', resolvedYear: '2020' },
  { id: 's031', state: 'READ',  originalText: 'Project Hail Mary',resolvedTitle: 'Project Hail Mary',resolvedAuthor: 'Andy Weir',     resolvedYear: '2021' },

  // Q
  { id: 's032', state: 'FOUND', originalText: 'Quiet', resolvedTitle: 'Quiet: The Power of Introverts', resolvedAuthor: 'Susan Cain', resolvedYear: '2012' },

  // R
  { id: 's033', state: 'FOUND', originalText: 'Rebecca',   resolvedTitle: 'Rebecca',   resolvedAuthor: 'Daphne du Maurier',  resolvedYear: '1938' },
  { id: 's034', state: 'READ',  originalText: 'The Road',  resolvedTitle: 'The Road',  resolvedAuthor: 'Cormac McCarthy',    resolvedYear: '2006' },

  // S
  { id: 's035', state: 'FOUND', originalText: 'Sapiens',          resolvedTitle: 'Sapiens: A Brief History of Humankind', resolvedAuthor: 'Yuval Noah Harari', resolvedYear: '2011' },
  { id: 's036', state: 'FOUND', originalText: 'Slaughterhouse-Five', resolvedTitle: 'Slaughterhouse-Five',               resolvedAuthor: 'Kurt Vonnegut',     resolvedYear: '1969' },

  // T
  { id: 's037', state: 'FOUND', originalText: 'The Remains of the Day',resolvedTitle: 'The Remains of the Day',resolvedAuthor: 'Kazuo Ishiguro',  resolvedYear: '1989' },
  { id: 's038', state: 'READ',  originalText: 'Things Fall Apart',     resolvedTitle: 'Things Fall Apart',     resolvedAuthor: 'Chinua Achebe',   resolvedYear: '1958' },

  // U
  { id: 's039', state: 'FOUND', originalText: 'Ulysses', resolvedTitle: 'Ulysses', resolvedAuthor: 'James Joyce', resolvedYear: '1922' },

  // V
  { id: 's040', state: 'FOUND', originalText: 'Vanity Fair', resolvedTitle: 'Vanity Fair', resolvedAuthor: 'William Makepeace Thackeray', resolvedYear: '1848' },

  // W
  { id: 's041', state: 'FOUND', originalText: 'White Noise',resolvedTitle: 'White Noise',resolvedAuthor: 'Don DeLillo',    resolvedYear: '1985' },
  { id: 's042', state: 'READ',  originalText: 'Wolf Hall',  resolvedTitle: 'Wolf Hall',  resolvedAuthor: 'Hilary Mantel',  resolvedYear: '2009' },

  // X
  { id: 's043', state: 'FOUND', originalText: 'Xenogenesis', resolvedTitle: 'Xenogenesis', resolvedAuthor: 'Octavia E. Butler', resolvedYear: '1987' },

  // Y
  { id: 's044', state: 'FOUND', originalText: 'The Year of Magical Thinking', resolvedTitle: 'The Year of Magical Thinking', resolvedAuthor: 'Joan Didion', resolvedYear: '2005' },

  // Z
  { id: 's045', state: 'FOUND', originalText: 'Zorba the Greek', resolvedTitle: 'Zorba the Greek', resolvedAuthor: 'Nikos Kazantzakis', resolvedYear: '1946' },
];
