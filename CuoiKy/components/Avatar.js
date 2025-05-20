import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Avatar = ({ uri, size = 48 }) => {
  return (
    <Image source={{ uri }} style={[styles.avatar, { width: size, height: size }]} />
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
  },
});

export default Avatar;
