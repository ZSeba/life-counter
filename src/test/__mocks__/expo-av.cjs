'use strict'

const { vi } = require('vitest')

const mockPlayAsync = vi.fn().mockResolvedValue()
const mockSetPositionAsync = vi.fn().mockResolvedValue()
const mockSetOnPlaybackStatusUpdate = vi.fn()
const mockUnloadAsync = vi.fn().mockResolvedValue()

const mockSound = {
  playAsync: mockPlayAsync,
  setPositionAsync: mockSetPositionAsync,
  setOnPlaybackStatusUpdate: mockSetOnPlaybackStatusUpdate,
  unloadAsync: mockUnloadAsync,
}

const createAsync = vi.fn().mockResolvedValue({ sound: mockSound })

const Audio = {
  Sound: { createAsync },
  setAudioModeAsync: vi.fn().mockResolvedValue(),
}

module.exports = { Audio }
