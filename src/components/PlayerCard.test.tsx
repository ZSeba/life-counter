import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react-native'
import PlayerCard from './PlayerCard'
import type { Player } from '../utils/constants'

function makePlayer(overrides: Partial<Player> = {}): Player {
  return { id: 0, name: 'P1', life: 20, ...overrides }
}

describe('PlayerCard', () => {
  it('renders the player name', () => {
    render(
      <PlayerCard player={makePlayer()} index={0} playerCount={2} onUpdateLife={vi.fn()} />
    )
    expect(screen.getByText('P1')).toBeTruthy()
  })

  it('renders the life total', () => {
    render(
      <PlayerCard player={makePlayer({ life: 42 })} index={0} playerCount={2} onUpdateLife={vi.fn()} />
    )
    expect(screen.getByText('42')).toBeTruthy()
  })

  it('shows skull when life is 0', () => {
    render(
      <PlayerCard player={makePlayer({ life: 0 })} index={0} playerCount={2} onUpdateLife={vi.fn()} />
    )
    expect(screen.getByText('💀')).toBeTruthy()
    expect(screen.queryByText('0')).toBeNull()
  })

  it('shows skull when life is below 0', () => {
    render(
      <PlayerCard player={makePlayer({ life: -5 })} index={0} playerCount={2} onUpdateLife={vi.fn()} />
    )
    expect(screen.getByText('💀')).toBeTruthy()
  })

  it('renders plus and minus signs', () => {
    render(
      <PlayerCard player={makePlayer()} index={0} playerCount={2} onUpdateLife={vi.fn()} />
    )
    expect(screen.getByText('−')).toBeTruthy()
    expect(screen.getByText('+')).toBeTruthy()
  })

  it('calls onUpdateLife with -1 when minus pressed', () => {
    const onUpdateLife = vi.fn()
    render(
      <PlayerCard player={makePlayer({ id: 1, life: 20 })} index={0} playerCount={2} onUpdateLife={onUpdateLife} />
    )
    fireEvent.press(screen.getByText('−'))
    expect(onUpdateLife).toHaveBeenCalledWith(1, 19, 'tap')
  })

  it('calls onUpdateLife with +1 when plus pressed', () => {
    const onUpdateLife = vi.fn()
    render(
      <PlayerCard player={makePlayer({ id: 1, life: 20 })} index={0} playerCount={2} onUpdateLife={onUpdateLife} />
    )
    fireEvent.press(screen.getByText('+'))
    expect(onUpdateLife).toHaveBeenCalledWith(1, 21, 'tap')
  })

  it('calls onUpdateLife with -10 on long press minus', () => {
    const onUpdateLife = vi.fn()
    render(
      <PlayerCard player={makePlayer({ id: 1, life: 20 })} index={0} playerCount={2} onUpdateLife={onUpdateLife} />
    )
    fireEvent(screen.getByText('−'), 'longPress')
    expect(onUpdateLife).toHaveBeenCalledWith(1, 10, 'tap')
  })

  it('calls onUpdateLife with +10 on long press plus', () => {
    const onUpdateLife = vi.fn()
    render(
      <PlayerCard player={makePlayer({ id: 1, life: 20 })} index={0} playerCount={2} onUpdateLife={onUpdateLife} />
    )
    fireEvent(screen.getByText('+'), 'longPress')
    expect(onUpdateLife).toHaveBeenCalledWith(1, 30, 'tap')
  })

  it('applies 180 rotation for player 0 in 2-player mode', () => {
    const { toJSON } = render(
      <PlayerCard player={makePlayer()} index={0} playerCount={2} onUpdateLife={vi.fn()} />
    )
    const tree = JSON.stringify(toJSON())
    expect(tree).toContain('180deg')
  })

  it('does not apply rotation for player 1 in 2-player mode', () => {
    const { toJSON } = render(
      <PlayerCard player={makePlayer({ id: 1, name: 'P2' })} index={1} playerCount={2} onUpdateLife={vi.fn()} />
    )
    const tree = JSON.stringify(toJSON())
    expect(tree).not.toContain('transform')
  })

  it('applies 90 rotation for player 0 in 4-player mode', () => {
    const { toJSON } = render(
      <PlayerCard player={makePlayer()} index={0} playerCount={4} onUpdateLife={vi.fn()} />
    )
    const tree = JSON.stringify(toJSON())
    expect(tree).toContain('90deg')
  })

  it('applies -90 rotation for player 1 in 4-player mode', () => {
    const { toJSON } = render(
      <PlayerCard player={makePlayer({ id: 1, name: 'P2' })} index={1} playerCount={4} onUpdateLife={vi.fn()} />
    )
    const tree = JSON.stringify(toJSON())
    expect(tree).toContain('-90deg')
  })

  it('applies 180 rotation for player 0 in 3-player mode', () => {
    const { toJSON } = render(
      <PlayerCard player={makePlayer()} index={0} playerCount={3} onUpdateLife={vi.fn()} />
    )
    const tree = JSON.stringify(toJSON())
    expect(tree).toContain('180deg')
  })

  it('applies 90 rotation for player 1 in 3-player mode', () => {
    const { toJSON } = render(
      <PlayerCard player={makePlayer({ id: 1, name: 'P2' })} index={1} playerCount={3} onUpdateLife={vi.fn()} />
    )
    const tree = JSON.stringify(toJSON())
    expect(tree).toContain('90deg')
  })

  it('applies -90 rotation for player 2 in 3-player mode', () => {
    const { toJSON } = render(
      <PlayerCard player={makePlayer({ id: 2, name: 'P3' })} index={2} playerCount={3} onUpdateLife={vi.fn()} />
    )
    const tree = JSON.stringify(toJSON())
    expect(tree).toContain('-90deg')
  })

  it('applies 180 rotation for player 0 in 5-player mode', () => {
    const { toJSON } = render(
      <PlayerCard player={makePlayer()} index={0} playerCount={5} onUpdateLife={vi.fn()} />
    )
    const tree = JSON.stringify(toJSON())
    expect(tree).toContain('180deg')
  })

  it('applies 90/-90 rotations for players 1-4 in 5-player mode', () => {
    const expectations = ['90deg', '-90deg', '90deg', '-90deg']
    expectations.forEach((rot, i) => {
      const idx = i + 1
      const { toJSON } = render(
        <PlayerCard player={makePlayer({ id: idx, name: `P${idx + 1}` })} index={idx} playerCount={5} onUpdateLife={vi.fn()} />
      )
      const tree = JSON.stringify(toJSON())
      expect(tree).toContain(rot)
    })
  })

  it('applies alternating 90/-90 rotations for 6-player mode', () => {
    const expectations = ['90deg', '-90deg', '90deg', '-90deg', '90deg', '-90deg']
    expectations.forEach((rot, i) => {
      const { toJSON } = render(
        <PlayerCard player={makePlayer({ id: i, name: `P${i + 1}` })} index={i} playerCount={6} onUpdateLife={vi.fn()} />
      )
      const tree = JSON.stringify(toJSON())
      expect(tree).toContain(rot)
    })
  })
})
