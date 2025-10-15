import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function EchoLabScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      fontFamily: theme.typography.heading,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text,
      fontFamily: theme.typography.body,
      textAlign: 'center',
      marginTop: theme.spacing.md,
      opacity: 0.7,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Echo Lab</Text>
      <Text style={styles.subtitle}>Review your choices and paths</Text>
    </View>
  );
}

