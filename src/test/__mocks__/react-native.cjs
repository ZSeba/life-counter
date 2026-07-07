const React = require('react')

const MockComponent = (name) => {
  const comp = ({ children, style, ...props }) =>
    React.createElement(name, { ...props, style }, children)
  comp.displayName = name
  return comp
}

const originalModal = function ModalFn({ visible, children, ...props }) {
  if (process.env.VITEST && !visible) {
    // Signal that modal is returning null
    try { require('fs').appendFileSync('/tmp/modal-debug.log', `Modal visible=${visible} returning null\n`); } catch(e) {}
  }
  if (!visible) return null
  return React.createElement('Modal', { ...props, visible: true }, children)
}

module.exports = {
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
    hairlineWidth: 1,
    absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  },
  View: MockComponent('View'),
  Text: MockComponent('Text'),
  Pressable: ({ children, onPress, onLongPress, style, ...props }) =>
    React.createElement('Pressable', { ...props, style, onClick: onPress }, children),
  TouchableOpacity: MockComponent('TouchableOpacity'),
  Modal: originalModal,
  Switch: function SwitchFn(props) {
    return React.createElement('Switch', { ...props, accessibilityRole: 'switch' })
  },
  StatusBar: MockComponent('StatusBar'),
  Animated: {
    Value: class {
      constructor(v) { this._value = v }
      setValue(v) { this._value = v }
      __getValue() { return this._value }
    },
    timing: () => ({ start: (cb) => setTimeout(() => cb && cb({ finished: true }), 0) }),
    parallel: () => ({ start: (cb) => setTimeout(() => cb && cb({ finished: true }), 0) }),
    Text: MockComponent('AnimatedText'),
    View: MockComponent('AnimatedView'),
  },
  PanResponder: {
    create: () => ({ panHandlers: {} }),
  },
  Platform: { OS: 'ios', select: (obj) => obj.ios },
  Dimensions: { get: () => ({ width: 390, height: 844 }) },
  PixelRatio: { get: () => 3 },
  Appearance: { getColorScheme: () => 'light' },
  I18nManager: { isRTL: false },
  LayoutAnimation: { easeInEaseOut: () => {} },
  InteractionManager: { runAfterInteractions: (fn) => fn() },
  Keyboard: { dismiss: () => {}, addListener: () => ({ remove: () => {} }) },
  ActivityIndicator: MockComponent('ActivityIndicator'),
  Image: MockComponent('Image'),
  ImageBackground: MockComponent('ImageBackground'),
  ScrollView: MockComponent('ScrollView'),
  FlatList: MockComponent('FlatList'),
  SectionList: MockComponent('SectionList'),
  TextInput: MockComponent('TextInput'),
  KeyboardAvoidingView: MockComponent('KeyboardAvoidingView'),
  SafeAreaView: MockComponent('SafeAreaView'),
  RefreshControl: MockComponent('RefreshControl'),
  TouchableHighlight: MockComponent('TouchableHighlight'),
  TouchableNativeFeedback: MockComponent('TouchableNativeFeedback'),
  Button: MockComponent('Button'),
  Alert: { alert: (title, message) => {} },
  BackHandler: { addEventListener: () => ({ remove: () => {} }), exitApp: () => {} },
  Linking: { openURL: async () => true, canOpenURL: async () => true, addEventListener: () => ({ remove: () => {} }) },
  Share: { share: async () => ({ action: 'sharedAction' }) },
  Vibration: { vibrate: () => {} },
  LogBox: { ignoreLogs: () => {} },
  YellowBox: { ignoreWarnings: () => {} },
  NativeModules: {},
  NativeEventEmitter: class { constructor() {} addListener() { return { remove: () => {} } } },
  UIManager: {},
  DeviceEventEmitter: { addListener: () => ({ remove: () => {} }) },
  findNodeHandle: () => null,
  processColor: (color) => color,
}
