# Life Counter

A Magic: The Gathering life counter built with React Native and Expo. Supports 1–6 players, tap/long-press gestures, and sound effects.

## Features

- **Multiplayer** – Add up to 6 players
- **Gesture controls** – Tap to increment, long-press to decrement
- **Rotation support** – Cards rotate for 2-player and 4-player layouts
- **Sound effects** – Plays a sound on life change
- **Persistent settings** – Default life total and player colors via modal

## Run

```bash
npm start
# then scan the QR code with Expo Go, or press i/a/w for iOS/Android/web
```

## Tests

```bash
npm test        # run once
npm run test:watch  # watch mode
```

## Stack

- [Expo](https://expo.dev) SDK 54
- [React Native](https://reactnative.dev) 0.81
- [TypeScript](https://www.typescriptlang.org)
- [Vitest](https://vitest.dev) + React Test Renderer
