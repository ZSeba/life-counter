import { defineConfig } from 'vitest/config'
import path from 'path'

const mockDir = path.resolve(__dirname, 'src/test/__mocks__')

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    alias: {
      'react-native': path.resolve(mockDir, 'react-native.ts'),
    },
    server: {
      deps: {
        inline: ['react-native'],
      },
    },
  },

})
