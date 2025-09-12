import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import HeaderBar from './components/HeaderBar';
import ShowStream from './components/ShowStream';
// import ColourInfo from './components/ColourInfo';
// import SwitchBar from './components/SwitchBar';
// import StreamVideo from './components/StreamVideo';
// import PictureMode from './components/PictureMode';

export default function App() {
  const [mode, setMode] = useState<'stream' | 'picture'>('stream');
  const [colourData, setColourData] = useState({ name: '', code: '', hex: '#ffffff' });

  return (
    <View style={styles.container}>
      <HeaderBar />
      <Text>Current Mode: {mode}</Text>
      <ShowStream />
      {/* <ColourInfo colour={colourData} />
      {mode === 'stream' ? (
        <StreamVideo onColourUpdate={setColourData} />
      ) : (
        <PictureMode onColourUpdate={setColourData} />
      )}
      <SwitchBar mode={mode} setMode={setMode} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});