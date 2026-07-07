import { View, Text, TouchableOpacity, Modal, StyleSheet, Switch, ScrollView } from 'react-native'
import { COLORS, MIN_PLAYERS, MAX_PLAYERS } from '../utils/constants'
import type { LifeLogEntry } from '../utils/constants'

type Props = {
  visible: boolean
  onClose: () => void
  playerCount: number
  onPlayerCountChange: (count: number) => void
  startingLife: number
  onStartingLifeChange: (life: number) => void
  startingLifeOptions: readonly number[]
  soundEnabled: boolean
  onSoundToggle: () => void
  lifeLog: LifeLogEntry[]
}

function groupLog(entries: LifeLogEntry[]): LifeLogEntry[] {
  if (entries.length === 0) return []
  const grouped: LifeLogEntry[] = []
  const reversed = [...entries].reverse()
  let current = { ...reversed[0] }
  for (let i = 1; i < reversed.length; i++) {
    const entry = reversed[i]
    if (entry.playerName === current.playerName && Math.sign(entry.delta) === Math.sign(current.delta)) {
      current.delta += entry.delta
    } else {
      grouped.push(current)
      current = { ...entry }
    }
  }
  grouped.push(current)
  return grouped
}

export default function SettingsModal({
  visible,
  onClose,
  playerCount,
  onPlayerCountChange,
  startingLife,
  onStartingLifeChange,
  startingLifeOptions,
  soundEnabled,
  onSoundToggle,
  lifeLog,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Settings</Text>

          <Text style={styles.label}>Players</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, playerCount <= MIN_PLAYERS && styles.btnDisabled]}
              onPress={() => onPlayerCountChange(Math.max(MIN_PLAYERS, playerCount - 1))}
            >
              <Text style={styles.btnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.value}>{playerCount}</Text>
            <TouchableOpacity
              style={[styles.btn, playerCount >= MAX_PLAYERS && styles.btnDisabled]}
              onPress={() => onPlayerCountChange(Math.min(MAX_PLAYERS, playerCount + 1))}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Starting Life</Text>
          <View style={styles.row}>
            {startingLifeOptions.map((life) => (
              <TouchableOpacity
                key={life}
                style={[styles.lifeBtn, startingLife === life && styles.lifeBtnActive]}
                onPress={() => onStartingLifeChange(life)}
              >
                <Text style={[styles.lifeBtnText, startingLife === life && styles.lifeBtnTextActive]}>
                  {life}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Sound on damage</Text>
            <Switch
              value={soundEnabled}
              onValueChange={onSoundToggle}
              trackColor={{ false: '#555', true: COLORS.accent }}
              thumbColor={soundEnabled ? '#fff' : '#ccc'}
            />
          </View>

          <Text style={styles.label}>Life Log</Text>
          <View style={styles.logContainer}>
            {lifeLog.length === 0 ? (
              <Text style={styles.logEmpty}>No changes yet</Text>
            ) : (
              <ScrollView style={styles.logScroll} nestedScrollEnabled>
                {groupLog(lifeLog).map((entry, i) => (
                  <Text key={i} style={[styles.logEntry, { color: entry.delta > 0 ? COLORS.plus : COLORS.minus }]}>
                    {entry.playerName} {entry.delta > 0 ? 'gained' : 'lost'} {Math.abs(entry.delta)} life
                  </Text>
                ))}
              </ScrollView>
            )}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.modalBg,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 360,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 20,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.buttonBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '600',
  },
  value: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  lifeBtn: {
    width: 60,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.buttonBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lifeBtnActive: {
    backgroundColor: COLORS.accent,
  },
  lifeBtnText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  lifeBtnTextActive: {
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    maxHeight: 160,
  },
  logScroll: {
    maxHeight: 140,
  },
  logEmpty: {
    color: COLORS.text,
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
    paddingVertical: 8,
  },
  logEntry: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 3,
  },
  closeBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
