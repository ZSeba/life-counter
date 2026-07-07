import { describe, it, expect } from 'vitest'
import {
  COLORS,
  DEFAULT_LIFE,
  STARTING_LIFE_OPTIONS,
  MIN_PLAYERS,
  MAX_PLAYERS,
  TAP_THRESHOLD,
} from './constants'

describe('constants', () => {
  it('exports COLORS with expected keys', () => {
    expect(COLORS).toHaveProperty('background')
    expect(COLORS).toHaveProperty('plus')
    expect(COLORS).toHaveProperty('minus')
    expect(COLORS).toHaveProperty('playerColors')
    expect(COLORS.playerColors).toHaveLength(6)
  })

  it('exports correct default life', () => {
    expect(DEFAULT_LIFE).toBe(20)
  })

  it('exports starting life options', () => {
    expect(STARTING_LIFE_OPTIONS).toEqual([20, 30, 40])
  })

  it('exports player limits', () => {
    expect(MIN_PLAYERS).toBe(1)
    expect(MAX_PLAYERS).toBe(6)
  })

  it('exports tap threshold', () => {
    expect(TAP_THRESHOLD).toBe(10)
  })
})
