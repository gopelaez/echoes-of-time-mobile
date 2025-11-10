import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { fetchChapterDetail } from '../services/protagonistService';
import { ChapterDetailResponse, MontageScene } from '../types/protagonist';
import { useLanguage } from '../store/LanguageContext';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { MontagePlayer } from '../components/MontagePlayer';

type RootStackParamList = {
  Chapter: { personId: number; chapterNumber: number };
};

type ChapterScreenRouteProp = RouteProp<RootStackParamList, 'Chapter'>;
type ChapterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChapterScreen: React.FC = () => {
  const route = useRoute<ChapterScreenRouteProp>();
  const navigation = useNavigation<ChapterScreenNavigationProp>();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const { personId, chapterNumber } = route.params;
  
  const [chapterData, setChapterData] = useState<ChapterDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMontage, setShowMontage] = useState(false);

  // Define styles using theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentWrapper: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
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
      padding: 40,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: theme.typography.body,
    },
    backButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.md,
      marginTop: 20,
    },
    backButtonText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.typography.body,
    },
    backButtonOverlay: {
      position: 'absolute',
      left: 16,
      zIndex: 100,
      padding: 8,
      backgroundColor: theme.colors.surface + '80',
      borderRadius: 20,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingTop: 60,
      position: 'relative',
    },
    chapterDescriptionSection: {
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingTop: 40,
      position: 'relative',
    },
    playButtonSection: {
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingTop: 0,
      position: 'relative',
    },
    goldenDivider: {
      height: 1,
      marginTop: 24,
      marginBottom: 24,
    },
    chapterNumber: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
      fontFamily: theme.typography.body,
    },
    chapterTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      fontFamily: theme.typography.heading,
    },
    yearsCovered: {
      fontSize: 16,
      marginBottom: 16,
      fontFamily: theme.typography.body,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 12,
      fontFamily: theme.typography.heading,
    },
    description: {
      fontSize: 14,
      lineHeight: 24,
      fontFamily: theme.typography.body,
    },
    figurineContainer: {
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 8,
    },
    figurineContainerTopRight: {
      position: 'absolute',
      top: 60,
      left: 32,
      zIndex: 10,
    },
    chapterTextContainer: {
      // Margin will be applied dynamically via inline style
    },
    figurineImage: {
      width: 120,
      height: 180,
      borderRadius: theme.borderRadius.md,
    },
    debugText: {
      fontSize: 12,
      fontStyle: 'italic',
      fontFamily: theme.typography.body,
    },
    playButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: theme.borderRadius.md,
      gap: 8,
    },
    playButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.typography.body,
    },
    decisionsContainer: {
      flexDirection: 'column',
      gap: 12,
      marginTop: 16,
    },
    decisionSection: {
      marginTop: 0,
    },
    decisionSectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    decisionSectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: theme.typography.heading,
    },
    decisionTitleText: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      fontFamily: theme.typography.body,
    },
    decisionDescription: {
      fontSize: 14,
      lineHeight: 24,
      fontFamily: theme.typography.body,
    },
    finalWords: {
      fontSize: 14,
      lineHeight: 24,
      fontFamily: theme.typography.body,
    },
    decisionCard: {
      width: '100%',
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      borderWidth: 1,
      position: 'relative',
    },
    decisionCoverImage: {
      width: '100%',
      aspectRatio: 9 / 16,
    },
    decisionCoverPlaceholder: {
      width: '100%',
      aspectRatio: 9 / 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    decisionTitleOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 50,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    decisionTitle: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.typography.body,
      textAlign: 'center',
    },
    decisionButton: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
    },
    decisionButtonGradient: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    decisionButtonContainer: {
      width: '100%',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    decisionButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: theme.typography.body,
    },
  });

  useEffect(() => {
    loadChapter();
  }, [personId, chapterNumber, language]);

  const loadChapter = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChapterDetail(personId, chapterNumber, language);
      setChapterData(data);
    } catch (err) {
      console.error('Error loading chapter:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePlayMontage = () => {
    setShowMontage(true);
  };

  const handleMontageComplete = () => {
    setShowMontage(false);
  };

  const handleMontageClose = () => {
    setShowMontage(false);
  };

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

  if (error || !chapterData) {
    return (
      <ImageBackground
        source={require('../../assets/bg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.contentWrapper}>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.text }]}>{error || 'Chapter not found'}</Text>
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

  const { chapter, protagonist } = chapterData;

  // Debug: Log chapter data
  console.log('📖 Chapter data:', {
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    figurineUrl: chapter.figurineUrl,
  });

  // Fix duplicated base URL in figurineUrl if present
  const getFixedFigurineUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    
    // Check if URL contains the base URL twice
    const baseUrl = 'https://echoes-of-time-media-production-648435191406.s3.us-east-1.amazonaws.com';
    if (url.startsWith(baseUrl + baseUrl)) {
      // Remove the duplicate base URL
      return url.replace(baseUrl, '');
    }
    return url;
  };

  const fixedFigurineUrl = getFixedFigurineUrl(chapter.figurineUrl);

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
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backButtonOverlay, { top: insets.top }]}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          {/* Chapter Header */}
          <View style={styles.section}>
            {/* Figurine Image - Top Left */}
            {fixedFigurineUrl && (
              <View style={styles.figurineContainerTopRight}>
                <Image
                  source={{ uri: fixedFigurineUrl }}
                  style={styles.figurineImage}
                  resizeMode="contain"
                  onError={(error) => {
                    console.error('❌ Figurine image error:', error.nativeEvent.error);
                    console.error('❌ Figurine URL:', fixedFigurineUrl);
                  }}
                  onLoad={() => {
                    console.log('✅ Figurine image loaded:', fixedFigurineUrl);
                  }}
                />
              </View>
            )}
            
            <View style={[styles.chapterTextContainer, { marginLeft: fixedFigurineUrl ? 140 : 0 }]}>
              <Text style={[styles.chapterNumber, { color: theme.colors.accent }]}>
                {t('protagonist.chapter', 'Chapter')} {chapter.chapterNumber}
              </Text>
              <Text style={[styles.chapterTitle, { color: theme.colors.text }]}>
                {chapter.title}
              </Text>
              {chapter.yearsCovered && (
                <Text style={[styles.yearsCovered, { color: theme.colors.text + '80' }]}>
                  {chapter.yearsCovered}
                </Text>
              )}
            </View>
          </View>

          {/* Chapter Description */}
          {chapter.chapterDescription && (
            <View style={styles.chapterDescriptionSection}>
              <Text style={[styles.description, { color: theme.colors.text + 'CC' }]}>
                {chapter.chapterDescription}
              </Text>
            </View>
          )}

          {/* Historical Events Count */}
          {chapter.historicalEvents && chapter.historicalEvents.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Historical Events ({chapter.historicalEvents.length})
              </Text>
            </View>
          )}

          {/* Play Cinematic Scenes Button */}
          {chapter.scenes && chapter.scenes.length > 0 && (
            <View style={styles.playButtonSection}>
              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: theme.colors.accent }]}
                onPress={handlePlayMontage}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
                <Text style={styles.playButtonText}>
                  Play {t('protagonist.chapter', 'Chapter')} {chapter.chapterNumber}
                </Text>
              </TouchableOpacity>

              {/* Golden Divider */}
              <View style={[styles.goldenDivider, { backgroundColor: theme.colors.accent }]} />

              {/* Turning Point Decision Section */}
              {chapter.decisions && chapter.decisions.length > 0 && chapter.decisions[0] && (
                <View style={styles.decisionSection}>
                  <View style={styles.decisionSectionTitleContainer}>
                    <Ionicons name="git-branch" size={20} color={theme.colors.accent} />
                    <Text style={[styles.decisionSectionTitle, { color: theme.colors.text }]}>
                      {t('protagonist.turning_point_decision', 'Turning Point Decision')}
                    </Text>
                  </View>
                  {chapter.decisions[0].description && (
                    <Text style={[styles.decisionDescription, { color: theme.colors.text + 'CC' }]}>
                      {chapter.decisions[0].description}
                    </Text>
                  )}
                </View>
              )}

              {/* Decision Cards */}
              {chapter.decisions && chapter.decisions.length > 0 && (
                <View style={styles.decisionsContainer}>
                  {chapter.decisions.map((decision) => (
                    <View
                      key={decision.id}
                      style={[styles.decisionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    >
                      {decision.coverImage ? (
                        <Image
                          source={{ uri: decision.coverImage }}
                          style={styles.decisionCoverImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.decisionCoverPlaceholder, { backgroundColor: theme.colors.surface + '40' }]}>
                          <Ionicons name="image-outline" size={32} color={theme.colors.text + '60'} />
                        </View>
                      )}
                      {decision.title && (
                        <LinearGradient
                          colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.50)', 'transparent']}
                          locations={[0, 0.80, 1]}
                          style={styles.decisionTitleOverlay}
                        >
                          <Text style={[styles.decisionTitle, { color: theme.colors.text }]} numberOfLines={2}>
                            {decision.title}
                          </Text>
                        </LinearGradient>
                      )}
                      <TouchableOpacity
                        style={styles.decisionButton}
                        activeOpacity={0.8}
                        onPress={() => {
                          // TODO: Navigate to decision detail screen
                          console.log('Decision pressed:', decision.id);
                        }}
                      >
                        <LinearGradient
                          colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
                          style={styles.decisionButtonGradient}
                        >
                          <View style={[styles.decisionButtonContainer, { backgroundColor: theme.colors.accent }]}>
                            <Text style={styles.decisionButtonText}>
                              Make Decision
                            </Text>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Final Words - Last Chapter */}
          {chapter.finalWords && (
            <View style={styles.section}>
              <Text style={[styles.finalWords, { color: theme.colors.text + 'CC' }]}>
                {chapter.finalWords}
              </Text>
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
        {chapterData && (
          <MontagePlayer
            scenes={chapterData.chapter.scenes.sort((a, b) => a.orderIndex - b.orderIndex)}
            onComplete={handleMontageComplete}
            showSkip={true}
            onClose={handleMontageClose}
          />
        )}
      </Modal>
    </ImageBackground>
  );
};

