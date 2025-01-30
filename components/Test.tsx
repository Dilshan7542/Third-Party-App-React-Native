import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text>SDsdsdsd</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'blue',
    height:20,
    margin:50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'blue',
  },
});

export default MyComponent;
