import { View, Text, TouchableOpacity, Modal, StyleSheet, Switch } from 'react-native'
import { COLORS, MIN_PLAYERS, MAX_PLAYERS } from '../utils/constants'

export default function SettingsModal({
  visible,
  onClose,
  playerCount,
  onPlayerCountChange,
  soundEnabled,
  onSoundToggle,
}) {
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

          <View style={styles.switchRow}>
            <Text style={styles.label}>Sound on damage</Text>
            <Switch
              value={soundEnabled}
              onValueChange={onSoundToggle}
              trackColor={{ false: '#555', true: COLORS.accent }}
              thumbColor={soundEnabled ? '#fff' : '#ccc'}
            />
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
