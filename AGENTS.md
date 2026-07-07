# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Project state

### Setup
- Source files: `.ts`/`.tsx` with strict types, extends `expo/tsconfig.base`
- Test runner: vitest 3.2.7, `environment: 'node'`, React Test Renderer 19.1.0
- Mocking strategy:
  - `react-native` → `Module._resolveFilename` hook redirects to `src/test/__mocks__/react-native.cjs` (bypasses Flow type syntax in real `react-native/index.js`)
  - `expo-av` → `vi.mock` in `setup.ts` (vitest-level interception prevents Vite/Node from touching real ESM module which has unsupported `import './Audio'` directory import)
  - `../../assets/sounds/loss.mp3` → `Module._resolveFilename` hook redirects to `src/test/__mocks__/loss-mp3.cjs` (Node's native `require()` inside function bodies bypasses vitest's mock system)
  - `react-native-safe-area-context` → `vi.mock` in `setup.ts`
- `test.server.deps.inline: ['react-native']` in vitest config for SSR inlining
- Test sound module state reset via `vi.resetModules()` + `await import('./sound')` in `beforeEach(async ...)`

### Test status
- **SettingsModal**: 8/8 passing
- **Constants**: 5/5 passing
- **PlayerCard**: 13/13 passing
- **App**: 4/4 passing
- **Sound**: 3/3 passing
- **Total**: 33 tests, 5 files — all passing
