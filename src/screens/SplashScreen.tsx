import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme';

export default function SplashScreen() {
  const { theme } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000, // 3 seconds
      useNativeDriver: false,
    }).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    logo: {
      width: 300,
      height: 300,
      borderRadius: theme.borderRadius.lg,
    },
    progressContainer: {
      width: 250,
      height: 4,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing.xs,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.taupe, // Using theme taupe color
      borderRadius: theme.borderRadius.sm,
    },
  });

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { width: progressWidth }
          ]} 
        />
      </View>
    </View>
  );
}