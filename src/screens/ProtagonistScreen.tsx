import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { fetchProtagonistDetail, combineVoiceoverText, getMontageScenes } from '../services/protagonistService';
import { ProtagonistDetail, MontageScene } from '../types/protagonist';
import { useLanguage } from '../store/LanguageContext';
import { useTheme } from '../theme/ThemeProvider';
import { MontagePlayer } from '../components/MontagePlayer';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

type RootStackParamList = {
  Montage: { personId: number };
  Protagonist: { personId: number; preloadedData?: ProtagonistDetail };
  Chapter: { personId: number; chapterNumber: number };
};

type ProtagonistScreenRouteProp = RouteProp<RootStackParamList, 'Protagonist'>;
type ProtagonistScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProtagonistScreen: React.FC = () => {
  const route = useRoute<ProtagonistScreenRouteProp>();
  const navigation = useNavigation<ProtagonistScreenNavigationProp>();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const { personId, preloadedData } = route.params;
  
  const [protagonist, setProtagonist] = useState<ProtagonistDetail | null>(preloadedData || null);
  const [combinedVoiceover, setCombinedVoiceover] = useState<string>('');
  const [loading, setLoading] = useState(!preloadedData);
  const [error, setError] = useState<string | null>(null);
  const [showMontage, setShowMontage] = useState(false);
  const [montageScenes, setMontageScenes] = useState<MontageScene[]>([]);

  useEffect(() => {
    if (preloadedData) {
      // Use preloaded data immediately
      const scenes = getMontageScenes(preloadedData);
      setMontageScenes(scenes);
      const voiceoverText = combineVoiceoverText(scenes);
      setCombinedVoiceover(voiceoverText);
      setLoading(false);
      // Preload montage scene images
      preloadMontageImages(scenes);
    } else {
      // Fetch data if not preloaded
      loadProtagonistDetail();
    }
  }, [personId, language, preloadedData]);

  const preloadMontageImages = async (scenes: MontageScene[]) => {
    const imageUrls = scenes
      .map((scene) => scene.imageUrl)
      .filter((url): url is string => url !== null && url !== undefined);

    if (imageUrls.length === 0) {
      return;
    }

    console.log(`🖼️ Preloading ${imageUrls.length} montage scene images...`);

    // Preload all images in parallel
    const preloadPromises = imageUrls.map((url) =>
      Image.prefetch(url)
        .then((success) => {
          if (success) {
            console.log(`✅ Preloaded montage image: ${url}`);
          } else {
            console.warn(`⚠️ Failed to preload montage image: ${url}`);
          }
        })
        .catch((err) => {
          console.warn(`⚠️ Error preloading montage image ${url}:`, err);
        })
    );

    await Promise.all(preloadPromises);
    console.log(`✅ All montage scene images preloaded`);
  };

  const loadProtagonistDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchProtagonistDetail(personId, language);
      setProtagonist(data);
      
      const scenes = getMontageScenes(data);
      setMontageScenes(scenes);
      const voiceoverText = combineVoiceoverText(scenes);
      setCombinedVoiceover(voiceoverText);
      
      // Preload montage scene images
      preloadMontageImages(scenes);
    } catch (err) {
      console.error('Failed to load protagonist detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to load protagonist');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setShowMontage(true);
  };

  const handleChapterPress = (chapterNumber: number) => {
    if (!protagonist) return;
    navigation.navigate('Chapter', {
      personId: protagonist.id,
      chapterNumber,
    });
  };

  const handleMontageComplete = () => {
    setShowMontage(false);
  };

  const handleMontageClose = () => {
    setShowMontage(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0f1419', // Dark background to prevent white flash while bg.png loads
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: theme.typography.body,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'transparent',
    },
    backButtonHeader: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
      fontFamily: theme.typography.heading,
    },
    placeholder: {
      width: 32,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 16,
      paddingTop: 0,
    },
    worldImageContainer: {
      width: screenWidth,
      height: 200,
      backgroundColor: '#000000', // Black background to match image and prevent white flash
      marginBottom: -80, // Negative margin to overlap with portrait
      position: 'relative',
      overflow: 'hidden', // Prevent any overflow from showing
    },
    backButtonOverlay: {
      position: 'absolute',
      left: 0,
      padding: 16,
      zIndex: 10,
    },
    worldImage: {
      width: '100%',
      height: '100%',
    },
    portraitSection: {
      alignItems: 'center',
      marginBottom: 24,
      marginTop: 0, // Moved down further
      paddingHorizontal: 16,
    },
    imageContainer: {
      width: 150,
      height: 150,
      borderRadius: 75,
      overflow: 'hidden',
      marginBottom: 8,
      backgroundColor: '#1e2328',
      alignSelf: 'center',
    },
    portraitImage: {
      width: '100%',
      height: '100%',
    },
    protagonistName: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: theme.typography.heading,
      marginTop: 8,
    },
    protagonistYears: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: theme.typography.body,
      marginTop: 4,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      fontFamily: theme.typography.heading,
    },
    description: {
      fontSize: 15,
      lineHeight: 24,
      fontFamily: theme.typography.body,
    },
    voiceoverText: {
      fontSize: 15,
      lineHeight: 24,
      fontFamily: theme.typography.body,
    },
    historicalContextButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      gap: 8,
    },
    historicalContextButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.typography.body,
    },
    backButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    backButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.typography.body,
    },
    chaptersContainer: {
      gap: 12,
    },
    chapterCard: {
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      width: '100%',
      marginBottom: 0,
    },
    chapterContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    chapterContentLeft: {
      flexDirection: 'row',
    },
    chapterContentRight: {
      flexDirection: 'row-reverse',
    },
    chapterInfo: {
      flex: 1,
    },
    chapterInfoRight: {
      alignItems: 'flex-end',
    },
    chapterHeader: {
      marginBottom: 8,
    },
    chapterNumberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    chapterNumber: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: theme.typography.body,
      letterSpacing: 0.5,
    },
    completedIcon: {
      marginLeft: 4,
    },
    chapterTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: theme.typography.heading,
    },
    chapterTitleRight: {
      textAlign: 'right',
    },
    figurineImageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    figurineImage: {
      width: 80,
      height: 120,
      borderRadius: 8,
    },
  });

  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/bg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.contentWrapper}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (error || !protagonist) {
    return (
      <ImageBackground
        source={require('../../assets/bg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.contentWrapper}>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.text }]}>{error || 'Protagonist not found'}</Text>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.accent }]}
              onPress={handleGoBack}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* World Image - Full width at top */}
          {protagonist.worldImageUrl && (
            <View style={styles.worldImageContainer}>
              <Image
                source={{ uri: protagonist.worldImageUrl }}
                style={styles.worldImage}
                resizeMode="cover"
                fadeDuration={0}
              />
              {/* Back Button - Overlay on world image, positioned in safe zone */}
              <TouchableOpacity 
                onPress={handleGoBack} 
                style={[styles.backButtonOverlay, { top: insets.top }]}
              >
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          )}

          {/* Portrait Image */}
          {protagonist.protagonistPortraitUrl && (
            <View style={styles.portraitSection}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: protagonist.protagonistPortraitUrl }}
                  style={styles.portraitImage}
                  resizeMode="cover"
                  fadeDuration={0}
                />
              </View>
              <Text style={[styles.protagonistName, { color: theme.colors.text }]}>
                {protagonist.name}
              </Text>
              {(protagonist.birthYear || protagonist.deathYear) && (
                <Text style={[styles.protagonistYears, { color: theme.colors.text + '80' }]}>
                  {protagonist.birthYear || '?'} - {protagonist.deathYear || '?'}
                </Text>
              )}
            </View>
          )}

          {/* Description */}
          {protagonist.description && (
            <View style={styles.section}>
              <Text style={[styles.description, { color: theme.colors.text }]}>
                {protagonist.description}
              </Text>
            </View>
          )}

          {/* Historical Context Button */}
          {combinedVoiceover && (
            <View style={styles.section}>
              <TouchableOpacity
                style={[styles.historicalContextButton, { backgroundColor: theme.colors.accent }]}
                onPress={handlePlayAgain}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
                <Text style={styles.historicalContextButtonText}>{t('protagonist.play_historical_context', 'Play Historical Context')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Chapters */}
          {protagonist.chapters && protagonist.chapters.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('protagonist.chapters', 'Chapters')}
              </Text>
              <View style={styles.chaptersContainer}>
                {protagonist.chapters.map((chapter) => {
                  const isOdd = chapter.chapterNumber % 2 === 1;
                  const isCompleted = false; // No chapters completed for now
                  
                  return (
                    <TouchableOpacity
                      key={chapter.id}
                      style={[
                        styles.chapterCard, 
                        { 
                          backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.15)' : theme.colors.surface, 
                          borderColor: theme.colors.border 
                        }
                      ]}
                      activeOpacity={0.7}
                      onPress={() => handleChapterPress(chapter.chapterNumber)}
                    >
                      <View style={[styles.chapterContent, isOdd ? styles.chapterContentLeft : styles.chapterContentRight]}>
                        {/* Figurine Image - Left for odd, Right for even */}
                        {chapter.figurineUrl && (
                          <View style={styles.figurineImageContainer}>
                            <Image
                              source={{ uri: chapter.figurineUrl }}
                              style={[styles.figurineImage, { opacity: isCompleted ? 1 : 0.2 }]}
                              resizeMode="contain"
                            />
                          </View>
                        )}
                        {/* Chapter Info */}
                        <View style={[styles.chapterInfo, isOdd && styles.chapterInfoRight]}>
                          <View style={styles.chapterHeader}>
                            <View style={styles.chapterNumberContainer}>
                              <Text style={[styles.chapterNumber, { color: theme.colors.accent }]}>
                                {t('protagonist.chapter', 'Chapter')} {chapter.chapterNumber}
                              </Text>
                              {isCompleted && (
                                <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={styles.completedIcon} />
                              )}
                            </View>
                          </View>
                          <Text style={[styles.chapterTitle, { color: theme.colors.text }, isOdd && styles.chapterTitleRight]}>
                            {chapter.title}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

        </ScrollView>
      </View>

      {/* Montage Modal Overlay */}
      <Modal
        visible={showMontage}
        animationType="fade"
        transparent={false}
        onRequestClose={handleMontageClose}
        presentationStyle="fullScreen"
      >
        <MontagePlayer
          scenes={montageScenes}
          onComplete={handleMontageComplete}
          showSkip={true}
          onClose={handleMontageClose}
        />
      </Modal>
    </ImageBackground>
  );
};

