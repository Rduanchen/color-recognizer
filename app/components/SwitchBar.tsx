import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SwitchBar({ mode, setMode }: { mode: string; setMode: (m: any) => void }) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity
        style={[styles.button, mode === 'stream' && styles.active]}
        onPress={() => setMode('stream')}
      >
        <Text style={mode === 'stream' ? styles.activeText : styles.text}>Mode 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, mode === 'picture' && styles.active]}
        onPress={() => setMode('picture')}
      >
        <Text style={mode === 'picture' ? styles.activeText : styles.text}>Mode 2</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', margin: 16, justifyContent: 'center' },
  button: { padding: 8, borderRadius: 8, backgroundColor: '#eee', marginHorizontal: 4 },
  active: { backgroundColor: '#888' },
  text: { color: '#999' },
  activeText: { color: '#fff', fontWeight: 'bold' }
});