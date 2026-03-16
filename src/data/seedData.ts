import { BookItem } from '../types/book';

// Flip this to false to test the empty state of the app
export const USE_SEED_DATA = true;

export const SEED_BOOKS: BookItem[] = [
  // A
  { id: 's001', state: 'FOUND', originalText: 'Anna Karenina', resolvedTitle: 'Anna Karenina', resolvedAuthor: 'Leo Tolstoy' },
  { id: 's002', state: 'FOUND', originalText: 'American Gods', resolvedTitle: 'American Gods', resolvedAuthor: 'Neil Gaiman' },
  { id: 's003', state: 'READ',  originalText: 'Atomic Habits', resolvedTitle: 'Atomic Habits', resolvedAuthor: 'James Clear' },

  // B
  { id: 's004', state: 'FOUND', originalText: 'Beloved', resolvedTitle: 'Beloved', resolvedAuthor: 'Toni Morrison' },
  { id: 's005', state: 'READ',  originalText: 'Brave New World', resolvedTitle: 'Brave New World', resolvedAuthor: 'Aldous Huxley' },

  // C
  { id: 's006', state: 'FOUND', originalText: 'Crime and Punishment', resolvedTitle: 'Crime and Punishment', resolvedAuthor: 'Fyodor Dostoevsky' },
  { id: 's007', state: 'FOUND', originalText: 'Catch-22', resolvedTitle: 'Catch-22', resolvedAuthor: 'Joseph Heller' },

  // D
  { id: 's008', state: 'FOUND', originalText: 'Dune', resolvedTitle: 'Dune', resolvedAuthor: 'Frank Herbert' },
  { id: 's009', state: 'READ',  originalText: 'Demon Copperhead', resolvedTitle: 'Demon Copperhead', resolvedAuthor: 'Barbara Kingsolver' },

  // E
  { id: 's010', state: 'FOUND', originalText: 'East of Eden', resolvedTitle: 'East of Eden', resolvedAuthor: 'John Steinbeck' },
  { id: 's011', state: 'FOUND', originalText: 'Educated', resolvedTitle: 'Educated', resolvedAuthor: 'Tara Westover' },

  // F
  { id: 's012', state: 'FOUND', originalText: 'Foundation', resolvedTitle: 'Foundation', resolvedAuthor: 'Isaac Asimov' },
  { id: 's013', state: 'READ',  originalText: 'Flowers for Algernon', resolvedTitle: 'Flowers for Algernon', resolvedAuthor: 'Daniel Keyes' },

  // G
  { id: 's014', state: 'FOUND', originalText: 'The Great Gatsby', resolvedTitle: 'The Great Gatsby', resolvedAuthor: 'F. Scott Fitzgerald' },
  { id: 's015', state: 'FOUND', originalText: "The Girl with the Dragon Tattoo", resolvedTitle: "The Girl with the Dragon Tattoo", resolvedAuthor: 'Stieg Larsson' },

  // H
  { id: 's016', state: 'FOUND', originalText: 'Hamnet', resolvedTitle: 'Hamnet', resolvedAuthor: 'Maggie O\'Farrell' },
  { id: 's017', state: 'READ',  originalText: 'Homegoing', resolvedTitle: 'Homegoing', resolvedAuthor: 'Yaa Gyasi' },

  // I
  { id: 's018', state: 'FOUND', originalText: 'Invisible Man', resolvedTitle: 'Invisible Man', resolvedAuthor: 'Ralph Ellison' },
  { id: 's019', state: 'FOUND', originalText: 'It', resolvedTitle: 'It', resolvedAuthor: 'Stephen King' },

  // J
  { id: 's020', state: 'FOUND', originalText: 'Just Kids', resolvedTitle: 'Just Kids', resolvedAuthor: 'Patti Smith' },

  // K
  { id: 's021', state: 'FOUND', originalText: 'Kindred', resolvedTitle: 'Kindred', resolvedAuthor: 'Octavia E. Butler' },
  { id: 's022', state: 'READ',  originalText: 'Klara and the Sun', resolvedTitle: 'Klara and the Sun', resolvedAuthor: 'Kazuo Ishiguro' },

  // L
  { id: 's023', state: 'FOUND', originalText: 'Lolita', resolvedTitle: 'Lolita', resolvedAuthor: 'Vladimir Nabokov' },
  { id: 's024', state: 'FOUND', originalText: "The Left Hand of Darkness", resolvedTitle: "The Left Hand of Darkness", resolvedAuthor: 'Ursula K. Le Guin' },

  // M
  { id: 's025', state: 'FOUND', originalText: 'Middlemarch', resolvedTitle: 'Middlemarch', resolvedAuthor: 'George Eliot' },
  { id: 's026', state: 'READ',  originalText: 'Mythos', resolvedTitle: 'Mythos', resolvedAuthor: 'Stephen Fry' },

  // N
  { id: 's027', state: 'FOUND', originalText: 'Normal People', resolvedTitle: 'Normal People', resolvedAuthor: 'Sally Rooney' },
  { id: 's028', state: 'FOUND', originalText: 'Neuromancer', resolvedTitle: 'Neuromancer', resolvedAuthor: 'William Gibson' },

  // O
  { id: 's029', state: 'FOUND', originalText: 'On Earth We\'re Briefly Gorgeous', resolvedTitle: "On Earth We're Briefly Gorgeous", resolvedAuthor: 'Ocean Vuong' },

  // P
  { id: 's030', state: 'FOUND', originalText: 'Piranesi', resolvedTitle: 'Piranesi', resolvedAuthor: 'Susanna Clarke' },
  { id: 's031', state: 'READ',  originalText: 'Project Hail Mary', resolvedTitle: 'Project Hail Mary', resolvedAuthor: 'Andy Weir' },

  // Q
  { id: 's032', state: 'FOUND', originalText: 'Quiet', resolvedTitle: 'Quiet: The Power of Introverts', resolvedAuthor: 'Susan Cain' },

  // R
  { id: 's033', state: 'FOUND', originalText: 'Rebecca', resolvedTitle: 'Rebecca', resolvedAuthor: 'Daphne du Maurier' },
  { id: 's034', state: 'READ',  originalText: 'The Road', resolvedTitle: 'The Road', resolvedAuthor: 'Cormac McCarthy' },

  // S
  { id: 's035', state: 'FOUND', originalText: 'Sapiens', resolvedTitle: 'Sapiens: A Brief History of Humankind', resolvedAuthor: 'Yuval Noah Harari' },
  { id: 's036', state: 'FOUND', originalText: 'Slaughterhouse-Five', resolvedTitle: 'Slaughterhouse-Five', resolvedAuthor: 'Kurt Vonnegut' },

  // T
  { id: 's037', state: 'FOUND', originalText: 'The Remains of the Day', resolvedTitle: 'The Remains of the Day', resolvedAuthor: 'Kazuo Ishiguro' },
  { id: 's038', state: 'READ',  originalText: 'Things Fall Apart', resolvedTitle: 'Things Fall Apart', resolvedAuthor: 'Chinua Achebe' },

  // U
  { id: 's039', state: 'FOUND', originalText: 'Ulysses', resolvedTitle: 'Ulysses', resolvedAuthor: 'James Joyce' },

  // V
  { id: 's040', state: 'FOUND', originalText: 'Vanity Fair', resolvedTitle: 'Vanity Fair', resolvedAuthor: 'William Makepeace Thackeray' },

  // W
  { id: 's041', state: 'FOUND', originalText: 'White Noise', resolvedTitle: 'White Noise', resolvedAuthor: 'Don DeLillo' },
  { id: 's042', state: 'READ',  originalText: 'Wolf Hall', resolvedTitle: 'Wolf Hall', resolvedAuthor: 'Hilary Mantel' },

  // X
  { id: 's043', state: 'FOUND', originalText: 'Xenogenesis', resolvedTitle: 'Xenogenesis', resolvedAuthor: 'Octavia E. Butler' },

  // Y
  { id: 's044', state: 'FOUND', originalText: 'The Year of Magical Thinking', resolvedTitle: 'The Year of Magical Thinking', resolvedAuthor: 'Joan Didion' },

  // Z
  { id: 's045', state: 'FOUND', originalText: 'Zorba the Greek', resolvedTitle: 'Zorba the Greek', resolvedAuthor: 'Nikos Kazantzakis' },
];
