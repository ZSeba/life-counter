import { describe, it, expect, vi, beforeEach } from 'vitest'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadSettings, savePlayerCount, saveStartingLife } from './storage'

const MockStorage = AsyncStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
}

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadSettings', () => {
    it('returns null when no settings saved', async () => {
      MockStorage.getItem.mockResolvedValue(null)
      const result = await loadSettings()
      expect(result).toBeNull()
    })

    it('returns saved player count and starting life', async () => {
      MockStorage.getItem.mockImplementation((key: string) => {
        if (key === '@life-counter/playerCount') return Promise.resolve('4')
        if (key === '@life-counter/startingLife') return Promise.resolve('30')
        return Promise.resolve(null)
      })
      const result = await loadSettings()
      expect(result).toEqual({ playerCount: 4, startingLife: 30 })
    })
  })

  describe('savePlayerCount', () => {
    it('saves player count to storage', async () => {
      await savePlayerCount(3)
      expect(MockStorage.setItem).toHaveBeenCalledWith('@life-counter/playerCount', '3')
    })
  })

  describe('saveStartingLife', () => {
    it('saves starting life to storage', async () => {
      await saveStartingLife(40)
      expect(MockStorage.setItem).toHaveBeenCalledWith('@life-counter/startingLife', '40')
    })
  })
})
