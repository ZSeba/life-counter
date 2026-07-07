import { vi } from 'vitest'

const Module = require('module')
const path = require('path')
const originalResolve = Module._resolveFilename
const rnMockPath = path.resolve(__dirname, '__mocks__/react-native.cjs')
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === 'react-native') {
    return rnMockPath
  }
  if (request.endsWith('loss.mp3') || request === '../../assets/sounds/loss.mp3') {
    return path.resolve(__dirname, '__mocks__/loss-mp3.cjs')
  }
  return originalResolve.call(this, request, parent, isMain, options)
}

vi.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: vi.fn().mockResolvedValue({
        sound: {
          playAsync: vi.fn(),
          setPositionAsync: vi.fn(),
          setOnPlaybackStatusUpdate: vi.fn(),
          unloadAsync: vi.fn(),
        },
      }),
    },
    setAudioModeAsync: vi.fn(),
  },
}))

vi.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

vi.mock('../../assets/sounds/loss.mp3', () => ({ default: 'mocked-sound-path' }))
