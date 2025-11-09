import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Protagonist } from '../types/protagonist';
import { fetchProtagonists, fetchProtagonistDetail } from '../services/protagonistService';
import { ProtagonistCard } from '../components/ProtagonistCard';
import { useLanguage } from '../store/LanguageContext';

type LivesStackParamList = {
  LivesList: undefined;
  Montage: { personId: number };
  Protagonist: { personId: number; preloadedData?: any };
};

type LivesScreenNavigationProp = NativeStackNavigationProp<LivesStackParamList, 'LivesList'>;

export const LivesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [protagonists, setProtagonists] = useState<Protagonist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProtagonists = async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await fetchProtagonists(language, 20);
      setProtagonists(data);
    } catch (err) {
      console.error('Failed to load protagonists:', err);
      setError(err instanceof Error ? err.message : 'Failed to load protagonists');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProtagonists();
  }, [language]);

  const navigation = useNavigation<LivesScreenNavigationProp>();

  const handleProtagonistPress = async (protagonist: Protagonist) => {
    console.log('Protagonist tapped:', protagonist.name);

    try {
      // Fetch protagonist detail to get image URLs
      const protagonistDetail = await fetchProtagonistDetail(protagonist.id, language);

      // Preload images into memory (parallel)
      const imagePromises: Promise<void>[] = [];

      if (protagonistDetail.worldImageUrl) {
        imagePromises.push(
          Image.prefetch(protagonistDetail.worldImageUrl)
            .then(() => {})
            .catch((err) => {
              console.warn('Failed to preload world image:', err);
            })
        );
      }

      if (protagonistDetail.protagonistPortraitUrl) {
        imagePromises.push(
          Image.prefetch(protagonistDetail.protagonistPortraitUrl)
            .then(() => {})
            .catch((err) => {
              console.warn('Failed to preload portrait image:', err);
            })
        );
      }

      // Preload figurine images from chapters
      if (protagonistDetail.chapters) {
        protagonistDetail.chapters.forEach((chapter) => {
          if (chapter.figurineUrl) {
            imagePromises.push(
              Image.prefetch(chapter.figurineUrl)
                .then(() => {})
                .catch((err) => {
                  console.warn(`Failed to preload figurine for Chapter ${chapter.chapterNumber}:`, err);
                })
            );
          }
        });
      }

      // Wait for all images to be prefetched
      await Promise.all(imagePromises);
      console.log('✅ All images preloaded for:', protagonist.name);

      // Navigate with preloaded data
      navigation.navigate('Protagonist', {
        personId: protagonist.id,
        preloadedData: protagonistDetail,
      });
    } catch (err) {
      console.error('Failed to preload images:', err);
      // Navigate anyway even if preload fails
      navigation.navigate('Protagonist', { personId: protagonist.id });
    }
  };

  const handleRetry = () => {
    loadProtagonists();
  };

  const renderEmptyState = () => {
    if (loading) {
      return null;
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {t('lives.error_title', 'Unable to Load')}
          </Text>
          <Text style={[styles.emptyMessage, { color: theme.colors.text + '80' }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleRetry}
          >
            <Text style={[styles.retryButtonText, { color: '#FFFFFF' }]}>
              {t('lives.retry', 'Try Again')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          {t('lives.no_protagonists_title', 'No Lives Yet')}
        </Text>
        <Text style={[styles.emptyMessage, { color: theme.colors.text + '80' }]}>
          {t('lives.no_protagonists_message', 'New protagonists will appear here soon.')}
        </Text>
      </View>
    );
  };

  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t('lives.recently_enabled', 'Recently Added')}
      </Text>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="options-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="swap-vertical-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <ImageBackground
        source={require('../../assets/bg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {t('lives.title', 'Lives')}
            </Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="search-outline" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
            <Text style={[styles.loadingText, { color: theme.colors.text + '80' }]}>
              {t('lives.loading', 'Loading lives...')}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('lives.title', 'Lives')}
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={protagonists}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderSectionHeader()}
          ListEmptyComponent={renderEmptyState()}
          renderItem={({ item }) => (
            <ProtagonistCard protagonist={item} onPress={handleProtagonistPress} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadProtagonists(true)}
              tintColor={theme.colors.accent}
              colors={[theme.colors.accent]}
            />
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

