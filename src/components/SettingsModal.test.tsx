import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react-native'
import SettingsModal from './SettingsModal'

describe('SettingsModal', () => {
  const defaultProps = {
    visible: true,
    onClose: vi.fn(),
    playerCount: 2,
    onPlayerCountChange: vi.fn(),
    startingLife: 20,
    onStartingLifeChange: vi.fn(),
    startingLifeOptions: [20, 30, 40] as const,
    soundEnabled: true,
    onSoundToggle: vi.fn(),
  }

  it('renders when visible', () => {
    render(<SettingsModal {...defaultProps} />)
    expect(screen.getByText('Settings')).toBeTruthy()
    expect(screen.getByText('Players')).toBeTruthy()
    expect(screen.getByText('Starting Life')).toBeTruthy()
    expect(screen.getByText('Sound on damage')).toBeTruthy()
  })

  it('shows current player count', () => {
    render(<SettingsModal {...defaultProps} playerCount={4} />)
    expect(screen.getByText('4')).toBeTruthy()
  })

  it('calls onPlayerCountChange when +/- pressed', () => {
    render(<SettingsModal {...defaultProps} />)
    fireEvent.press(screen.getByText('−'))
    expect(defaultProps.onPlayerCountChange).toHaveBeenCalledWith(1)
    fireEvent.press(screen.getByText('+'))
    expect(defaultProps.onPlayerCountChange).toHaveBeenCalledWith(3)
  })

  it('highlights active starting life', () => {
    render(<SettingsModal {...defaultProps} startingLife={30} />)
    const life30 = screen.getByText('30')
    expect(life30.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: '#fff' })])
    )
  })

  it('calls onStartingLifeChange when life tapped', () => {
    render(<SettingsModal {...defaultProps} />)
    fireEvent.press(screen.getByText('30'))
    expect(defaultProps.onStartingLifeChange).toHaveBeenCalledWith(30)
  })

  it('shows sound toggle as enabled', () => {
    render(<SettingsModal {...defaultProps} soundEnabled={true} />)
    const switchEl = screen.UNSAFE_getByType('Switch')
    expect(switchEl.props.value).toBe(true)
  })

  it('shows sound toggle as disabled', () => {
    render(<SettingsModal {...defaultProps} soundEnabled={false} />)
    const switchEl = screen.UNSAFE_getByType('Switch')
    expect(switchEl.props.value).toBe(false)
  })

  it('calls onClose when Done pressed', () => {
    render(<SettingsModal {...defaultProps} />)
    fireEvent.press(screen.getByText('Done'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })
})
