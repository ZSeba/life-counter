import { Audio } from 'expo-av'
import type { AVPlaybackStatus } from 'expo-av'

let soundRef: Audio.Sound | null = null
let isPlaying = false

export async function playLossSound(): Promise<void> {
  if (isPlaying) return
  try {
    if (soundRef) {
      soundRef.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          isPlaying = false
        }
      })
      await soundRef.setPositionAsync(0)
      await soundRef.playAsync()
      isPlaying = true
      return
    }
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/loss.mp3'),
      { shouldPlay: true }
    )
    soundRef = sound
    isPlaying = true
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        isPlaying = false
      }
    })
  } catch {
    isPlaying = false
  }
}

export async function unloadSound(): Promise<void> {
  if (soundRef) {
    await soundRef.unloadAsync()
    soundRef = null
    isPlaying = false
  }
}
