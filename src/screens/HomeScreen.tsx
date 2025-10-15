import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { useScenario } from '../store/ScenarioContext';
import ScenarioCard from '../components/ScenarioCard';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { scenario, loading, error, refetchScenario } = useScenario();

  const handleBeginScenario = () => {
    // TODO: Navigate to scenario screen
    console.log('Beginning scenario...');
  };

  const handleRetry = () => {
    refetchScenario();
  };

  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    dateHeader: {
      paddingTop: 80,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      alignItems: 'center',
    },
    dateText: {
      fontSize: 18,
      color: theme.colors.taupe,
      fontFamily: theme.typography.heading,
      textAlign: 'center',
    },
    tagline: {
      fontSize: 16,
      color: theme.colors.taupe,
      fontFamily: theme.typography.headingItalic,
      textAlign: 'center',
      marginTop: theme.spacing.sm,    
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.taupe,
      fontFamily: theme.typography.body,
      marginTop: theme.spacing.md,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: 30,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.taupe,
      fontFamily: theme.typography.body,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    retryButton: {
      borderWidth: 1,
      borderColor: theme.colors.taupe,
      borderRadius: 25,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      backgroundColor: 'transparent',
    },
    retryButtonText: {
      fontSize: 14,
      color: theme.colors.taupe,
      fontFamily: theme.typography.body,
      fontWeight: '600',
      letterSpacing: 1,
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Today's Date */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.tagline}>Your Echo Awaits</Text>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.taupe} />
          <Text style={styles.loadingText}>Loading today's scenario...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scenario Card */}
      {scenario && !loading && !error && (
        <ScenarioCard
          title={scenario.title}
          subtitle={scenario.subtitle}
          location={scenario.location}
          description={scenario.description}
          imageUrl={scenario.imageUrl}
          onBegin={handleBeginScenario}
        />
      )}
    </ImageBackground>
  );
}

