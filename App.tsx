import { useState, useCallback, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PlayerCard from './src/components/PlayerCard'
import SettingsModal from './src/components/SettingsModal'
import { playLossSound, unloadSound } from './src/utils/sound'
import { loadSettings, savePlayerCount, saveStartingLife } from './src/utils/storage'
import { COLORS, DEFAULT_LIFE, STARTING_LIFE_OPTIONS } from './src/utils/constants'
import type { Player, LifeLogEntry } from './src/utils/constants'

function buildPlayers(count: number, startingLife: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `P${i + 1}`,
    life: startingLife,
  }))
}

export default function App() {
  const [players, setPlayers] = useState<Player[]>(() => buildPlayers(2, DEFAULT_LIFE))
  const [startingLife, setStartingLife] = useState(DEFAULT_LIFE)
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const soundRef = useRef(soundEnabled)
  soundRef.current = soundEnabled
  const [lifeLog, setLifeLog] = useState<LifeLogEntry[]>([])
  const playersRef = useRef(players)
  playersRef.current = players

  useEffect(() => {
    loadSettings().then((saved) => {
      if (saved) {
        setStartingLife(saved.startingLife)
        setPlayers(buildPlayers(saved.playerCount, saved.startingLife))
      }
    })
    return () => { unloadSound() }
  }, [])

  const playerCount = players.length

  useEffect(() => { savePlayerCount(playerCount) }, [playerCount])
  useEffect(() => { saveStartingLife(startingLife) }, [startingLife])

  const handleStartingLifeChange = useCallback((life: number) => {
    setStartingLife(life)
    setPlayers((prev) => prev.map((p) => ({ ...p, life })))
  }, [])

  const handlePlayerCountChange = useCallback((count: number) => {
    setPlayers((prev) => {
      if (count > prev.length) {
        return [...prev, ...buildPlayers(count, startingLife).slice(prev.length)]
      }
      return prev.slice(0, count)
    })
  }, [startingLife])

  const tapTimestamps = useRef<Record<number, number[]>>({})

  const handleUpdateLife = useCallback((id: number, newLife: number, source: 'tap' | 'swipe') => {
    const curPlayers = playersRef.current
    const player = curPlayers.find((p) => p.id === id)
    if (player && newLife !== player.life) {
      setLifeLog((prev) => [...prev, { playerName: player.name, delta: newLife - player.life }])
    }
    setPlayers((prev) => {
      const p = prev.find((p) => p.id === id)
      if (p && newLife < p.life && source === 'tap') {
        const now = Date.now()
        const timestamps = (tapTimestamps.current[id] || []).filter((t) => now - t < 1500)
        timestamps.push(now)
        tapTimestamps.current[id] = timestamps
        if (soundRef.current && timestamps.length >= 5) {
          tapTimestamps.current[id] = []
          playLossSound()
        }
      } else {
        tapTimestamps.current[id] = []
      }
      return prev.map((p) => (p.id === id ? { ...p, life: newLife } : p))
    })
  }, [])

  const cols = playerCount <= 2 ? 1 : playerCount <= 4 ? 2 : 3

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
            onPress={() => {
              setPlayers((prev) => prev.map((p) => ({ ...p, life: startingLife })))
              setLifeLog([])
            }}
            style={styles.resetBtn}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {playerCount === 3 ? (
          <View style={styles.grid}>
            <View style={styles.threeTop}>
              <PlayerCard
                player={players[0]}
                index={0}
                playerCount={3}
                onUpdateLife={handleUpdateLife}
              />
            </View>
            <View style={styles.threeBottom}>
              <View style={styles.threeBottomHalf}>
                <PlayerCard
                  player={players[1]}
                  index={1}
                  playerCount={3}
                  onUpdateLife={handleUpdateLife}
                />
              </View>
              <View style={styles.threeBottomHalf}>
                <PlayerCard
                  player={players[2]}
                  index={2}
                  playerCount={3}
                  onUpdateLife={handleUpdateLife}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
            {players.map((player, i) => (
              <View key={player.id} style={{ width: `${100 / cols}%` }}>
                <PlayerCard
                  player={player}
                  index={i}
                    playerCount={playerCount}
                  onUpdateLife={handleUpdateLife}
                />
              </View>
            ))}
          </View>)}

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          playerCount={playerCount}
          onPlayerCountChange={handlePlayerCountChange}
          startingLife={startingLife}
          onStartingLifeChange={handleStartingLifeChange}
          startingLifeOptions={STARTING_LIFE_OPTIONS}
          soundEnabled={soundEnabled}
          onSoundToggle={() => setSoundEnabled((s) => !s)}
          lifeLog={lifeLog}
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
  gearText: { fontSize: 24, color: COLORS.text },
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
  grid: { flex: 1, alignContent: 'stretch' },
  threeTop: { flex: 0.8 },
  threeBottom: { flex: 1.2, flexDirection: 'row' },
  threeBottomHalf: { flex: 1 },
})
