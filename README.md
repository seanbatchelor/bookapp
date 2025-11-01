# Book Playground App

A simple React Native book library app built with Expo, featuring local data persistence.

## Tech Stack

- **Expo** - React Native framework
- **React Navigation** - Navigation between screens
- **React Native StyleSheet** - Native styling (clean, minimal design)
- **AsyncStorage** - Local data persistence
- **TypeScript** - Type safety

## Features

- ✅ View your book library in a clean list
- ✅ Add new books with a simple form
- ✅ Data persists between app sessions using AsyncStorage
- ✅ Minimal, modern UI with clean styling
- ✅ Floating action button for adding books
- ✅ Navigation between Library and Add Book screens

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

1. **Library Screen** (default):
   - View all your saved books
   - Tap the **+** button (bottom right) to add a new book

2. **Add Book Screen**:
   - Enter a book title
   - Tap **Save** to add it to your library
   - Tap **Cancel** to go back without saving

3. **Data Persistence**:
   - All books are automatically saved to AsyncStorage
   - Your library persists even after closing the app

## Project Structure

```
book-playground/
├── src/
│   ├── screens/
│   │   ├── LibraryScreen.tsx    # Main library view with book list
│   │   └── AddBookScreen.tsx    # Form to add new books
│   └── types/
│       └── navigation.ts        # TypeScript navigation types
├── App.tsx                      # Main app with navigation setup
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
- Try restarting the Expo development server
- Clear the Expo Go app cache

### Styles not applying
- Make sure you've run `npm start` to rebuild after any config changes
- Try clearing the Metro bundler cache: `npm start -- --clear`

### Books not persisting
- Check the console logs for AsyncStorage errors
- Make sure you're testing on a real device or simulator (not web)

## Next Steps

Some ideas to extend this app:
- Add book authors, descriptions, and cover images
- Implement search and filtering
- Add categories or tags
- Include reading status (to-read, reading, finished)
- Add a detail view for each book
- Implement swipe-to-delete functionality
