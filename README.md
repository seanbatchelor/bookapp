# Book Playground App

An interactive book-tracking prototype built with Expo, React Native, and NativeWind. Features intelligent book lookup simulation and state-driven UI interactions.

## Tech Stack

- **Expo SDK 54** - React Native framework
- **React Navigation** - Stack-based navigation
- **NativeWind v4** - Tailwind CSS for React Native
- **React Context** - State management
- **TypeScript** - Type safety

## Features

### Core Functionality
- **Smart Book Lookup** - Mocked search simulating Google Books API
- **8 Item States** - EMPTY, ACTIVE, SUBMITTED, SEARCHING, FOUND, OPTIONS_FOUND, NO_OPTIONS_FOUND, READ
- **Interactive List** - Add books with floating action button
- **Automatic Reordering** - Read books move to separate section
- **Detail Views** - Context-aware screens based on item state
- **Delete with Confirmation** - Modal confirmation before deletion

### State Transitions
1. **Add Book** → Creates EMPTY item, auto-focuses input
2. **Type Query** → Transitions to ACTIVE state
3. **Submit** → SUBMITTED → SEARCHING (800ms) → Result state
4. **Found Book** → Tap to view details, checkbox to mark as READ
5. **Multiple Options** → Tap to choose from list
6. **No Results** → Tap to retry with different query

### UI Design
- Minimal notepad aesthetic using spacing and rules
- NativeWind/Tailwind CSS styling throughout
- Clean state indicators (colors, icons, loading states)
- Responsive touch interactions

## Getting Started

### Prerequisites

1. Install Node.js (v16 or higher)
2. Install Expo Go app on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation

The dependencies are already installed, but if you need to reinstall them:

```bash
npm install
```

### Running the App

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open on your device:**
   - A QR code will appear in your terminal
   - Open the **Expo Go** app on your phone
   - Scan the QR code:
     - **iOS**: Use the Camera app to scan the QR code
     - **Android**: Use the Expo Go app's built-in QR scanner

3. **Alternative methods:**
   - Press `i` in the terminal to open iOS Simulator (Mac only, requires Xcode)
   - Press `a` in the terminal to open Android Emulator (requires Android Studio)
   - Press `w` in the terminal to open in web browser

### Usage

1. **Home Screen**:
   - View your reading list with "To Read" and "Read" sections
   - Tap **+** button to add a new book
   - Type a book title and press enter/search

2. **Testing the Mock Lookup**:
   - Try "Ulysses" → Single match (James Joyce)
   - Try "poem" → Multiple matches (Celan, Glück)
   - Try "Gatsby" → Single match (F. Scott Fitzgerald)
   - Try "Harry" → Multiple matches (Harry Potter series)
   - Try anything else → No matches

3. **Item Interactions**:
   - **FOUND state**: Tap to view details, check to mark as READ
   - **OPTIONS_FOUND**: Tap to choose from multiple matches
   - **NO_OPTIONS_FOUND**: Tap to retry with different query
   - **READ state**: Automatically moves to "Read" section

4. **Item Screen**:
   - View book details (title, author, original query)
   - Select from multiple options when available
   - Retry search with different query if no results
   - Delete button with confirmation modal

## Project Structure

```
book-playground/
├── src/
│   ├── components/
│   │   └── BookItemRow.tsx      # Book list item with state rendering
│   ├── context/
│   │   └── BooksContext.tsx     # React Context for state management
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Main reading list with sections
│   │   └── ItemScreen.tsx       # Detail/options/retry views
│   ├── types/
│   │   ├── book.ts              # Book item and state types
│   │   └── navigation.ts        # Navigation types
│   └── utils/
│       └── mockLookup.ts        # Mocked book search function
├── App.tsx                      # Main app with navigation & provider
├── global.css                   # Tailwind CSS imports
├── tailwind.config.js           # Tailwind configuration
├── babel.config.js              # Babel config for NativeWind
└── nativewind-env.d.ts         # TypeScript declarations for NativeWind
```

## Development Commands

- `npm start` - Start the Expo development server
- `npm run android` - Open on Android device/emulator
- `npm run ios` - Open on iOS simulator (Mac only)
- `npm run web` - Open in web browser

## Troubleshooting

### App won't load on Expo Go
- Make sure your phone and computer are on the same WiFi network
- Try restarting the Expo development server: `npm start -- --clear`
- Clear the Expo Go app cache

### NativeWind styles not applying
- Restart with cache clearing: `npm start -- --clear`
- Check that `global.css` is imported in `App.tsx`
- Verify `babel.config.js` includes `nativewind/babel` plugin

### TypeScript errors
- Run `npx tsc --noEmit` to check for type errors
- Ensure `nativewind-env.d.ts` exists for className prop support

## Implementation Notes

### State Management
- Uses React Context for global state (no persistence)
- All state transitions handled in `BooksContext.tsx`
- Clean separation between UI and business logic

### Mock Lookup
- 800ms delay simulates network request
- Pattern matching on query string (case-insensitive)
- Returns single match, multiple options, or no results

### Design Decisions
- Minimal UI with light notepad metaphor
- Section headers separate unread/read books
- Auto-focus on new items for quick entry
- Inline state indicators (colors, loading, messages)
- Modal confirmation for destructive actions

## Future Enhancements

Potential additions:
- Real Google Books API integration
- Local persistence with AsyncStorage
- Book cover images
- Reading progress tracking
- Notes and highlights
- Export/import functionality
- Search and filter within list
