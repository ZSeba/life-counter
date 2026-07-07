import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react-native'
import App from '../../App'

vi.mock('../utils/sound', () => ({
  playLossSound: vi.fn(),
  unloadSound: vi.fn(),
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the title', () => {
    render(<App />)
    expect(screen.getByText('Life Counter')).toBeTruthy()
  })

  it('renders 2 player cards by default', () => {
    render(<App />)
    expect(screen.getAllByText(/P[12]/)).toHaveLength(2)
  })

  it('renders gear button and reset button', () => {
    render(<App />)
    expect(screen.getByText('⚙')).toBeTruthy()
    expect(screen.getByText('Reset')).toBeTruthy()
  })

  it('shows settings modal when gear pressed', () => {
    render(<App />)
    fireEvent.press(screen.getByText('⚙'))
    expect(screen.getByText('Settings')).toBeTruthy()
  })
})
