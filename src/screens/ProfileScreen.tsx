import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { useLanguage } from '../store/LanguageContext';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../utils/languageDetection';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { language, setLanguage, isLoading } = useLanguage();

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    if (newLanguage !== language) {
      await setLanguage(newLanguage);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      fontFamily: theme.typography.heading,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.typography.heading,
      marginBottom: theme.spacing.md,
    },
    languageContainer: {
      gap: theme.spacing.sm,
    },
    languageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedLanguageButton: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '10',
    },
    languageText: {
      fontSize: 16,
      color: theme.colors.text,
      fontFamily: theme.typography.body,
    },
    selectedLanguageText: {
      color: theme.colors.accent,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: theme.spacing.md,
      color: theme.colors.text,
      fontFamily: theme.typography.body,
      fontSize: 16,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>{t('profile.loadingPreferences')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('profile.title')}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
          <View style={styles.languageContainer}>
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => {
              const isSelected = code === language;
              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.languageButton,
                    isSelected && styles.selectedLanguageButton,
                  ]}
                  onPress={() => handleLanguageChange(code as SupportedLanguage)}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.languageText,
                      isSelected && styles.selectedLanguageText,
                    ]}
                  >
                    {name}
                  </Text>
                  {isSelected && (
                    <Text style={[styles.languageText, styles.selectedLanguageText]}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

