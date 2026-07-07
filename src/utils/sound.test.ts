import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Audio } from 'expo-av'

type SoundModule = {
  playLossSound: () => Promise<void>
  unloadSound: () => Promise<void>
}

describe('sound', () => {
  let sound: SoundModule

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    sound = await import('./sound') as SoundModule
  })

  it('creates and plays a sound on first call', async () => {
    await sound.playLossSound()
    expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(1)
    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
      'mocked-sound-path',
      { shouldPlay: true }
    )
  })

  it('does not play if already playing', async () => {
    await sound.playLossSound()
    await sound.playLossSound()
    expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(1)
  })

  it('unloads sound on unloadSound', async () => {
    await sound.playLossSound()
    await sound.unloadSound()
    expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(1)
  })
})
