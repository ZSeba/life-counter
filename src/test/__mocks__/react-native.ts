import React from 'react'

const MockComponent = (name: string) => {
  const comp = ({ children, style, ...props }: any) =>
    React.createElement(name, { style, ...props }, children)
  comp.displayName = name
  return comp
}

export const StyleSheet = {
  create: (styles: any) => styles,
  flatten: (style: any) => style,
  hairlineWidth: 1 as const,
  absoluteFill: { position: 'absolute' as const, top: 0 as const, left: 0 as const, right: 0 as const, bottom: 0 as const },
  absoluteFillObject: { position: 'absolute' as const, top: 0 as const, left: 0 as const, right: 0 as const, bottom: 0 as const },
}

export const View = MockComponent('View')
export const Text = MockComponent('Text')
export const Pressable = ({ children, onPress, onLongPress, style, ...props }: any) =>
  React.createElement('Pressable', { ...props, style, onClick: onPress }, children)
export const TouchableOpacity = MockComponent('TouchableOpacity')
export const Modal = MockComponent('Modal')
export const Switch = MockComponent('Switch')
export const StatusBar = MockComponent('StatusBar')

export const Animated = {
  Value: class {
    _value: any
    constructor(v: any) { this._value = v }
    setValue(v: any) { this._value = v }
    __getValue() { return this._value }
  },
  timing: () => ({ start: (cb: any) => setTimeout(() => cb && cb({ finished: true }), 0) }),
  parallel: () => ({ start: (cb: any) => setTimeout(() => cb && cb({ finished: true }), 0) }),
  Text: MockComponent('AnimatedText'),
  View: MockComponent('AnimatedView'),
}

export const PanResponder = {
  create: () => ({ panHandlers: {} }),
}

export const Platform = { OS: 'ios' as const, select: (obj: any) => obj.ios }
export const Dimensions = { get: () => ({ width: 390, height: 844 }) }
export const PixelRatio = { get: () => 3 }
export const Appearance = { getColorScheme: () => 'light' as const }
export const I18nManager = { isRTL: false }
export const LayoutAnimation = { easeInEaseOut: () => {} }
export const InteractionManager = { runAfterInteractions: (fn: any) => fn() }
export const Keyboard = { dismiss: () => {}, addListener: () => ({ remove: () => {} }) }

export const ActivityIndicator = MockComponent('ActivityIndicator')
export const Image = MockComponent('Image')
export const ImageBackground = MockComponent('ImageBackground')
export const ScrollView = MockComponent('ScrollView')
export const FlatList = MockComponent('FlatList')
export const SectionList = MockComponent('SectionList')
export const TextInput = MockComponent('TextInput')
export const KeyboardAvoidingView = MockComponent('KeyboardAvoidingView')
export const SafeAreaView = MockComponent('SafeAreaView')
export const RefreshControl = MockComponent('RefreshControl')
export const TouchableHighlight = MockComponent('TouchableHighlight')
export const TouchableNativeFeedback = MockComponent('TouchableNativeFeedback')
export const TouchableWithoutFeedback = MockComponent('TouchableWithoutFeedback')
export const Button = MockComponent('Button')
export const Alert = { alert: (title: string, message?: string) => {} }
export const BackHandler = { addEventListener: () => ({ remove: () => {} }), exitApp: () => {} }
export const Linking = { openURL: async () => true, canOpenURL: async () => true, addEventListener: () => ({ remove: () => {} }) }
export const Share = { share: async () => ({ action: 'sharedAction' }) }
export const Vibration = { vibrate: () => {} }
export const LogBox = { ignoreLogs: () => {} }
export const YellowBox = { ignoreWarnings: () => {} }
export const NativeModules = { }
export const NativeEventEmitter = class { constructor() {} addListener() { return { remove: () => {} } } }
export const UIManager = { }
export const DeviceEventEmitter = { addListener: () => ({ remove: () => {} }) }
export const findNodeHandle = () => null
export const processColor = (color: any) => color

export default {
  StyleSheet,
  View, Text, Pressable, TouchableOpacity,
  Modal, Switch, StatusBar,
  Animated,
  PanResponder,
  Platform, Dimensions, PixelRatio, Appearance, I18nManager,
  LayoutAnimation, InteractionManager, Keyboard,
  ActivityIndicator, Image, ImageBackground, ScrollView, FlatList, SectionList,
  TextInput, KeyboardAvoidingView, SafeAreaView, RefreshControl,
  TouchableHighlight, TouchableNativeFeedback, TouchableWithoutFeedback,
  Button, Alert, BackHandler, Linking, Share, Vibration,
  LogBox, YellowBox,
  NativeModules, NativeEventEmitter, UIManager, DeviceEventEmitter,
  findNodeHandle, processColor,
}
