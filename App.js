import { useState, useCallback, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PlayerCard from './src/components/PlayerCard'
import SettingsModal from './src/components/SettingsModal'
import { playLossSound, unloadSound } from './src/utils/sound'
import { COLORS, DEFAULT_LIFE } from './src/utils/constants'

function buildPlayers(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `P${i + 1}`,
    life: DEFAULT_LIFE,
  }))
}

export default function App() {
  const [players, setPlayers] = useState(() => buildPlayers(2))
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const soundRef = useRef(soundEnabled)
  soundRef.current = soundEnabled

  useEffect(() => {
    return () => { unloadSound() }
  }, [])

  const handlePlayerCountChange = useCallback((count) => {
    setPlayers((prev) => {
      if (count > prev.length) {
        return [...prev, ...buildPlayers(count).slice(prev.length)]
      }
      return prev.slice(0, count)
    })
  }, [])

  const handleUpdateLife = useCallback((id, newLife) => {
    setPlayers((prev) => {
      const player = prev.find((p) => p.id === id)
      if (soundRef.current && player && newLife < player.life) {
        playLossSound()
      }
      return prev.map((p) => (p.id === id ? { ...p, life: newLife } : p))
    })
  }, [])

  const playerCount = players.length
  const cols = playerCount <= 2 ? playerCount : playerCount <= 4 ? 2 : 3

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.gearBtn}>
            <Text style={styles.gearText}>⚙</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Life Counter</Text>
          <TouchableOpacity
            onPress={() => setPlayers((prev) => prev.map((p) => ({ ...p, life: DEFAULT_LIFE })))}
            style={styles.resetBtn}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {players.map((player, i) => (
            <View key={player.id} style={{ width: `${100 / cols}%` }}>
              <PlayerCard
                player={player}
                index={i}
                onUpdateLife={handleUpdateLife}
              />
            </View>
          ))}
        </View>

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          playerCount={playerCount}
          onPlayerCountChange={handlePlayerCountChange}
          soundEnabled={soundEnabled}
          onSoundToggle={() => setSoundEnabled((s) => !s)}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  gearBtn: { padding: 8 },
  gearText: { fontSize: 24 },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.buttonBg,
  },
  resetText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  grid: { flex: 1, justifyContent: 'center' },
})
