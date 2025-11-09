import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../theme';
import { useScenario } from '../store/ScenarioContext';
import ScenarioCard from '../components/ScenarioCard';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { scenario, loading, error, refetchScenario } = useScenario();

  const handleBeginScenario = () => {
    // TODO: Navigate to scenario screen
    console.log('Beginning scenario...');
  };

  const handleRetry = () => {
    refetchScenario();
  };

  const handleCopyError = async () => {
    try {
      await Clipboard.setStringAsync(error || 'No error message available');
      Alert.alert('Copied', 'Error message copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      Alert.alert('Error', 'Failed to copy error message');
    }
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
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'center',
    },
    copyButton: {
      borderWidth: 1,
      borderColor: '#ff6b6b',
      borderRadius: 25,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      backgroundColor: 'transparent',
    },
    copyButtonText: {
      fontSize: 14,
      color: '#ff6b6b',
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
        <Text style={styles.tagline}>{t('home.tagline')}</Text>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>TRY AGAIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyError}>
              <Text style={styles.copyButtonText}>COPY ERROR</Text>
            </TouchableOpacity>
          </View>
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

