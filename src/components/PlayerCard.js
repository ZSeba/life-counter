import { useRef } from 'react'
import { View, Text, StyleSheet, PanResponder } from 'react-native'
import { COLORS, TAP_THRESHOLD } from '../utils/constants'

export default function PlayerCard({ player, index, onUpdateLife }) {
  const onUpdateRef = useRef(onUpdateLife)
  onUpdateRef.current = onUpdateLife

  const panY = useRef(0)
  const startY = useRef(0)
  const isVertical = useRef(false)
  const moved = useRef(false)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > TAP_THRESHOLD,
      onPanResponderGrant: (_, gs) => {
        startY.current = gs.y0
        panY.current = 0
        isVertical.current = false
        moved.current = false
      },
      onPanResponderMove: (_, gs) => {
        if (Math.abs(gs.dy) > TAP_THRESHOLD && !isVertical.current) {
          isVertical.current = true
        }
        if (isVertical.current) {
          moved.current = true
          panY.current = gs.dy
        }
      },
      onPanResponderRelease: () => {
        if (isVertical.current && moved.current) {
          if (panY.current > 0) {
            onUpdateRef.current(player.id, player.life - 1)
          } else {
            onUpdateRef.current(player.id, player.life + 1)
          }
        } else if (!moved.current) {
          onUpdateRef.current(player.id, player.life + 1)
        }
        panY.current = 0
        isVertical.current = false
        moved.current = false
      },
    })
  ).current

  const color = COLORS.playerColors[index % COLORS.playerColors.length]

  return (
    <View style={[styles.card, { borderColor: color }]} {...panResponder.panHandlers}>
      <View style={styles.topHalf}>
        <Text style={[styles.plusSign, { color: COLORS.plus }]}>+</Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.lifeText}>{player.life}</Text>
        <Text style={[styles.playerName, { color }]}>{player.name}</Text>
      </View>
      <View style={styles.bottomHalf}>
        <Text style={[styles.minusSign, { color: COLORS.minus }]}>−</Text>
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
    overflow: 'hidden',
    position: 'relative',
    minHeight: 180,
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
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
  plusSign: {
    fontSize: 32,
    fontWeight: '300',
    opacity: 0.3,
  },
  minusSign: {
    fontSize: 32,
    fontWeight: '300',
    opacity: 0.3,
  },
})
