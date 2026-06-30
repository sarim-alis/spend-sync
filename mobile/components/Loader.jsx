import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ size = 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#e15b64" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
