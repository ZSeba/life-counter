import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  playerCount: '@life-counter/playerCount',
  startingLife: '@life-counter/startingLife',
} as const

export type SavedSettings = {
  playerCount: number
  startingLife: number
}

export async function loadSettings(): Promise<SavedSettings | null> {
  const [playerCount, startingLife] = await Promise.all([
    AsyncStorage.getItem(KEYS.playerCount),
    AsyncStorage.getItem(KEYS.startingLife),
  ])
  if (playerCount === null || startingLife === null) return null
  return { playerCount: Number(playerCount), startingLife: Number(startingLife) }
}

export async function savePlayerCount(count: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.playerCount, String(count))
}

export async function saveStartingLife(life: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.startingLife, String(life))
}
