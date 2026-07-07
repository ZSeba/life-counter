export const COLORS = {
  background: '#1a1a2e',
  cardBackground: '#16213e',
  cardBorder: '#0f3460',
  text: '#e8e8e8',
  plus: '#4ade80',
  minus: '#f87171',
  accent: '#e94560',
  buttonBg: '#0f3460',
  modalOverlay: 'rgba(0,0,0,0.7)',
  modalBg: '#16213e',
  playerColors: ['#e94560', '#4ade80', '#fbbf24', '#60a5fa', '#c084fc', '#fb923c'],
} as const

export const DEFAULT_LIFE = 20
export const STARTING_LIFE_OPTIONS = [20, 30, 40] as const
export const MIN_PLAYERS = 1
export const MAX_PLAYERS = 6
export const TAP_THRESHOLD = 10

export type Player = {
  id: number
  name: string
  life: number
}
