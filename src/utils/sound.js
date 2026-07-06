import { Audio } from 'expo-av'

let soundRef = null

export async function playLossSound() {
  try {
    if (soundRef) {
      await soundRef.replayAsync()
      return
    }
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/loss.wav'),
      { shouldPlay: true }
    )
    soundRef = sound
  } catch {
    // silently fail
  }
}

export async function unloadSound() {
  if (soundRef) {
    await soundRef.unloadAsync()
    soundRef = null
  }
}
