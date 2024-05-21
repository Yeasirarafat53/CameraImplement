import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CameraScreen from './src/CameraScreen';

const App = () => {
  return (
    <View style={{flex:1,backgroundColor:"#f6fff8"}}>
      <CameraScreen />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
