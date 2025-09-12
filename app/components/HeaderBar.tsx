import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeaderBar() {
  return (
    <View style={styles.header}>
      <TouchableOpacity>
        <Ionicons name="menu" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#ddd',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16
  }
});