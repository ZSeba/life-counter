import { useState, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, PanResponder, Animated, Pressable } from 'react-native'
import type { GestureResponderEvent, PanResponderGestureState, LayoutChangeEvent } from 'react-native'
import { COLORS, TAP_THRESHOLD } from '../utils/constants'
import type { Player } from '../utils/constants'

type Props = {
  player: Player
  index: number
  playerCount: number
  onUpdateLife: (id: number, newLife: number, source: 'tap' | 'swipe') => void
}

function getRotation(index: number, playerCount: number): number {
  if (playerCount === 4) return [90, -90, 90, -90][index] || 0
  if (playerCount === 2) return index === 0 ? 180 : 0
  if (playerCount === 3) return [180, 90, -90][index] || 0
  return 0
}

export default function PlayerCard({ player, index, playerCount, onUpdateLife }: Props) {
  const onUpdateRef = useRef(onUpdateLife)
  onUpdateRef.current = onUpdateLife
  const playerRef = useRef(player)
  playerRef.current = player
  const rotation = useRef(getRotation(index, playerCount))
  rotation.current = getRotation(index, playerCount)

  const panY = useRef(0)
  const isSwiping = useRef(false)

  const [displayChange, setDisplayChange] = useState<number | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(0)).current
  const pendingChange = useRef(0)
  const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showChange = useCallback((change: number) => {
    if (change === 0) return
    pendingChange.current += change
    setDisplayChange(pendingChange.current)
    fadeAnim.setValue(1)
    slideAnim.setValue(0)
    if (changeTimer.current) clearTimeout(changeTimer.current)
    changeTimer.current = setTimeout(() => {
      pendingChange.current = 0
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => setDisplayChange(null))
    }, 400)
  }, [fadeAnim, slideAnim])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_: GestureResponderEvent, gs: PanResponderGestureState) => Math.abs(gs.dy) > TAP_THRESHOLD,
      onPanResponderGrant: () => {
        panY.current = 0
        isSwiping.current = false
      },
      onPanResponderMove: (_: GestureResponderEvent, gs: PanResponderGestureState) => {
        if (Math.abs(gs.dy) > TAP_THRESHOLD) {
          isSwiping.current = true
          panY.current = gs.dy
        }
      },
      onPanResponderRelease: () => {
        if (isSwiping.current) {
          const cur = playerRef.current
          const change = panY.current > 0 ? -1 : 1
          onUpdateRef.current(cur.id, cur.life + change, 'swipe')
          showChange(change)
        }
        panY.current = 0
        isSwiping.current = false
      },
    })
  ).current

  const onPress = useCallback((delta: number) => {
    const cur = playerRef.current
    onUpdateRef.current(cur.id, cur.life + delta, 'tap')
    showChange(delta)
  }, [showChange])

  const color = COLORS.playerColors[index % COLORS.playerColors.length]

  const rot = rotation.current

  const lifeContent = (
    <View style={styles.lifeStack}>
      <View style={styles.lifeRow}>
        {player.life <= 0 ? (
          <Text style={styles.skull}>💀</Text>
        ) : (
          <Text style={styles.lifeText}>{player.life}</Text>
        )}
        {displayChange !== null && (
          <Animated.Text style={[styles.changeText, { opacity: fadeAnim, color: displayChange > 0 ? COLORS.plus : COLORS.minus, transform: [{ translateY: slideAnim }] }]}>
            {displayChange > 0 ? '+' : ''}{displayChange}
          </Animated.Text>
        )}
      </View>
      <Text style={[styles.playerName, { color }]}>{player.name}</Text>
    </View>
  )

  return (
    <View
      style={[styles.card, { borderColor: color }]}
      {...panResponder.panHandlers}>
      <View style={[styles.row, rot !== 0 && { transform: [{ rotate: rot + 'deg' }] }]}>
        <View style={styles.sideLeft}>
          <Pressable onPress={() => onPress(-1)} onLongPress={() => onPress(-10)} delayLongPress={500}>
            <Text style={[styles.sign, { color: COLORS.minus }]}>−</Text>
          </Pressable>
        </View>
        <View style={styles.center}>
          {lifeContent}
        </View>
        <View style={styles.sideRight}>
          <Pressable onPress={() => onPress(1)} onLongPress={() => onPress(10)} delayLongPress={500}>
            <Text style={[styles.sign, { color: COLORS.plus }]}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 2,
    margin: 4,
    minHeight: 120,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sideLeft: {
    justifyContent: 'center',
  },
  sideRight: {
    justifyContent: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lifeStack: {
    alignItems: 'center',
  },
  lifeRow: {
    alignItems: 'center',
  },
  changeText: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
    position: 'absolute',
    bottom: '100%',
    alignSelf: 'center',
  },
  skull: {
    fontSize: 48,
  },
  lifeText: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: '800',
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sign: {
    fontSize: 64,
    fontWeight: '800',
    opacity: 0.5,
  },
})
