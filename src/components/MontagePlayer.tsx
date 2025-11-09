import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MontageScene } from '../types/protagonist';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface MontagePlayerProps {
  scenes: MontageScene[];
  onComplete: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  onClose?: () => void;
}

export const MontagePlayer: React.FC<MontagePlayerProps> = ({
  scenes,
  onComplete,
  onSkip,
  showSkip = true,
  onClose,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [imageError, setImageError] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const progressAnimations = useRef<Animated.Value[]>([]).current;
  const animationTimers = useRef<{ [key: number]: Animated.CompositeAnimation | null }>({}).current;
  const lastProgressValues = useRef<{ [key: number]: number }>({}).current;
  const isManualNavigation = useRef(false);
  const isNavigating = useRef(false);
  const lastNavigationTime = useRef<number>(0);
  const NAVIGATION_DEBOUNCE_MS = 300;

  // Initialize animations for all scenes
  useEffect(() => {
    // Ensure we have enough animation values for all scenes
    while (progressAnimations.length < scenes.length) {
      progressAnimations.push(new Animated.Value(0));
    }
    // Reset all animations
    progressAnimations.forEach((anim) => anim.setValue(0));
  }, [scenes.length]);

  const currentScene = scenes[currentIndex];

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [sound]);

  // Reset progress when scene changes
  useEffect(() => {
    setCurrentProgress(0);
    setCurrentDuration(0);
    setCurrentWordIndex(-1);
    setImageHeight(null); // Reset image height for new scene
    // Since images are preloaded, mark as loaded immediately if image URL exists
    const scene = scenes[currentIndex];
    setImageLoaded(!!scene?.imageUrl);
    isManualNavigation.current = false; // Reset manual navigation flag
    // Don't reset isNavigating here - let it be reset by the navigation handlers
    // Reset animation for current scene
    if (progressAnimations[currentIndex]) {
      progressAnimations[currentIndex].setValue(0);
      lastProgressValues[currentIndex] = 0;
    }
  }, [currentIndex, scenes]);

  // Play scene when index changes
  useEffect(() => {
    if (scenes.length === 0) {
      onComplete();
      return;
    }

    if (currentIndex < 0) {
      // Temporary state for restart, skip
      return;
    }

    if (currentIndex >= scenes.length) {
      // All scenes completed
      setIsPlaying(false);
      onComplete();
      return;
    }

    playScene(scenes[currentIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const playScene = async (scene: MontageScene) => {
    if (!scene.audioUrl) {
      // No audio, animate progress bar over 10 seconds then move to next scene
      if (progressAnimations[currentIndex]) {
        progressAnimations[currentIndex].setValue(0);
        lastProgressValues[currentIndex] = 0;
        
        const anim = Animated.timing(progressAnimations[currentIndex], {
          toValue: 1,
          duration: 10000, // 10 seconds
          useNativeDriver: false,
        });
        
        animationTimers[currentIndex] = anim;
        anim.start(() => {
          animationTimers[currentIndex] = null;
          // Move to next scene when animation completes (only if not manually navigated)
          if (!isManualNavigation.current) {
            setCurrentIndex((prevIndex) => {
              if (prevIndex < scenes.length - 1) {
                return prevIndex + 1;
              } else {
                onComplete();
                return prevIndex;
              }
            });
          }
          isManualNavigation.current = false;
        });
      } else {
        // Fallback: move to next scene after delay
        setTimeout(() => {
          setCurrentIndex((prevIndex) => {
            if (prevIndex < scenes.length - 1) {
              return prevIndex + 1;
            } else {
              onComplete();
              return prevIndex;
            }
          });
        }, 10000);
      }
      return;
    }

    try {
      setIsLoading(true);
      setImageError(false);

      // Stop and unload previous audio
      if (sound) {
        await sound.unloadAsync();
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Load and play new audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: scene.audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);
      setIsPaused(false);
      setIsLoading(false);

      // Get audio duration first, then set up progress bar and playback handler
      const status = await newSound.getStatusAsync();
      let audioDuration = 10000; // Default 10 seconds
      if (status.isLoaded && status.durationMillis) {
        audioDuration = Math.max(status.durationMillis, 10000); // At least 10 seconds
      }

      // Start smooth animation for progress bar (matches audio duration)
      if (progressAnimations[currentIndex]) {
        // Reset to 0
        progressAnimations[currentIndex].setValue(0);
        lastProgressValues[currentIndex] = 0;
        
        // Animate from 0 to 100% over the audio duration
        const anim = Animated.timing(progressAnimations[currentIndex], {
          toValue: 1,
          duration: audioDuration,
          useNativeDriver: false,
        });
        
        animationTimers[currentIndex] = anim;
        anim.start(() => {
          animationTimers[currentIndex] = null;
          // Animation completes, but navigation is handled by audio completion
          // This prevents premature navigation if audio is still playing
        });
      }

      // Handle playback status updates (for audio completion detection and word highlighting)
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          // Update progress state (for reference)
          if (status.positionMillis !== undefined && status.durationMillis !== undefined) {
            const progress = status.positionMillis / status.durationMillis;
            setCurrentProgress(progress);
            setCurrentDuration(status.durationMillis);
            
            // Calculate which word should be highlighted based on progress
            const subtitleText = scene.voiceover || scene.text || '';
            const words = subtitleText.split(/\s+/).filter(word => word.length > 0);
            if (words.length > 0) {
              const wordIndex = Math.floor(progress * words.length);
              setCurrentWordIndex(Math.min(wordIndex, words.length - 1));
            }
          }
          
          if (status.didJustFinish) {
            // Audio finished - ensure progress bar is complete and move to next scene
            if (progressAnimations[currentIndex] && animationTimers[currentIndex]) {
              animationTimers[currentIndex]?.stop();
              progressAnimations[currentIndex].setValue(1);
              animationTimers[currentIndex] = null;
            }
            // Highlight all words when finished
            const subtitleText = scene.voiceover || scene.text || '';
            const words = subtitleText.split(/\s+/).filter(word => word.length > 0);
            setCurrentWordIndex(words.length - 1);
            // Only advance if not manually navigated
            if (!isManualNavigation.current) {
              handleNextScene();
            }
            isManualNavigation.current = false;
          }
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
      setIsPlaying(false);
      // Move to next scene on error
      handleNextScene();
    }
  };

  const handleNextScene = () => {
    setCurrentIndex((prevIndex) => {
      return handleNextSceneIndex(prevIndex);
    });
  };

  const handlePlayPause = async () => {
    if (!sound) {
      // If no sound loaded, start playing current scene
      if (currentScene) {
        playScene(currentScene);
      }
      return;
    }

    try {
      if (isPaused) {
        // Resume playback
        await sound.playAsync();
        setIsPaused(false);
      } else {
        // Pause playback
        await sound.pauseAsync();
        setIsPaused(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleSkip = () => {
    if (sound) {
      sound.stopAsync().catch(console.error);
      sound.unloadAsync().catch(console.error);
    }
    setIsPlaying(false);
    setIsPaused(false);
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const handlePreviousScene = () => {
    const now = Date.now();
    // Prevent rapid successive clicks - check both lock and timestamp
    if (isNavigating.current || (now - lastNavigationTime.current < NAVIGATION_DEBOUNCE_MS)) {
      return;
    }
    
    isNavigating.current = true;
    lastNavigationTime.current = now;
    
    // Use functional update to ensure we have the latest index
    setCurrentIndex((prevIndex) => {
      // Double-check after getting the actual current index
      if (prevIndex < 0) {
        // Already in transition, release lock
        setTimeout(() => {
          isNavigating.current = false;
        }, 0);
        return prevIndex;
      }
      
      isManualNavigation.current = true;
      
      // Stop current audio and animation
      if (sound) {
        sound.stopAsync().catch(console.error);
        sound.unloadAsync().catch(console.error);
      }
      if (animationTimers[prevIndex]) {
        animationTimers[prevIndex]?.stop();
        animationTimers[prevIndex] = null;
      }
      
      if (prevIndex > 0) {
        // Go to previous scene
        setTimeout(() => {
          isNavigating.current = false;
        }, NAVIGATION_DEBOUNCE_MS);
        return prevIndex - 1;
      } else {
        // On first scene (index 0), restart from the beginning
        // Reset all progress bars
        progressAnimations.forEach((anim, index) => {
          anim.setValue(0);
          lastProgressValues[index] = 0;
          if (animationTimers[index]) {
            animationTimers[index]?.stop();
            animationTimers[index] = null;
          }
        });
        
        // Force restart by temporarily setting to -1 then back to 0
        setTimeout(() => {
          setCurrentIndex(0);
          // Reset navigation lock after scene change completes
          setTimeout(() => {
            isNavigating.current = false;
          }, 100);
        }, 0);
        
        return -1; // Temporary state for restart
      }
    });
  };

  const handleNextSceneManual = () => {
    const now = Date.now();
    // Prevent rapid successive clicks - check both lock and timestamp
    if (isNavigating.current || (now - lastNavigationTime.current < NAVIGATION_DEBOUNCE_MS)) {
      return;
    }
    
    isNavigating.current = true;
    lastNavigationTime.current = now;
    
    // Use functional update to ensure we have the latest index
    setCurrentIndex((prevIndex) => {
      // Double-check after getting the actual current index
      if (prevIndex < 0) {
        // Already in transition, release lock
        setTimeout(() => {
          isNavigating.current = false;
        }, 0);
        return prevIndex;
      }
      
      isManualNavigation.current = true;
      
      // Stop current audio and animation
      if (sound) {
        sound.stopAsync().catch(console.error);
        sound.unloadAsync().catch(console.error);
      }
      if (animationTimers[prevIndex]) {
        animationTimers[prevIndex]?.stop();
        animationTimers[prevIndex] = null;
      }
      
      setTimeout(() => {
        isNavigating.current = false;
      }, NAVIGATION_DEBOUNCE_MS);
      
      return handleNextSceneIndex(prevIndex);
    });
  };

  const handleNextSceneIndex = (index: number): number => {
    // Stop any ongoing animation
    if (animationTimers[index]) {
      animationTimers[index]?.stop();
      animationTimers[index] = null;
    }
    
    if (index < scenes.length - 1) {
      return index + 1;
    } else {
      setIsPlaying(false);
      setIsPaused(false);
      onComplete();
      return index;
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (scenes.length === 0 || !currentScene) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          No scenes available
        </Text>
      </View>
    );
  }

  const tabBarHeight = 90 + insets.bottom;
  
  // Debug: Log dimensions
  useEffect(() => {
    console.log('📐 MontagePlayer dimensions:', {
      screenWidth: width,
      screenHeight: height,
      tabBarHeight,
      insetsTop: insets.top,
      insetsBottom: insets.bottom,
      imageContainerHeight: height + 90 + insets.bottom,
    });
  }, [width, height, tabBarHeight, insets]);
  
  return (
    <View style={[styles.container, { height: height + tabBarHeight, width: width }]}>
      {/* Tap Areas for Navigation */}
      <View style={styles.tapAreasContainer}>
        {/* Left tap area - Previous scene / Restart */}
        <TouchableOpacity
          style={styles.tapArea}
          onPress={handlePreviousScene}
          activeOpacity={0.9}
        />
        {/* Right tap area - Next scene */}
        <TouchableOpacity
          style={styles.tapArea}
          onPress={handleNextSceneManual}
          activeOpacity={0.9}
        />
      </View>

      {/* Scene Image with Overlay */}
      <View 
        style={[styles.imageContainer, { 
          top: 0,
          height: height - 150, // Subtract subtitle section height (~150px)
          width: width,
        }]}
        onLayout={(event) => {
          const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
          console.log('📐 ImageContainer layout:', {
            width: layoutWidth,
            height: layoutHeight,
            expectedWidth: width,
            expectedHeight: height + 90 + insets.bottom,
          });
        }}
      >
        {currentScene.imageUrl && !imageError ? (
          <>
            <Image
              source={{ uri: currentScene.imageUrl }}
              style={[styles.image, {
                height: height - 150, // Subtract subtitle section height
              }]}
              resizeMode="cover"
              onError={handleImageError}
              onLoad={(event) => {
                // Image loaded (should be instant if preloaded)
                const { width: imageWidth, height: imageHeight } = event.nativeEvent.source;
                // Calculate height to fit screen width while maintaining aspect ratio
                const aspectRatio = imageHeight / imageWidth; // 1536/1024 = 1.5
                const calculatedHeight = width * aspectRatio; // 390 * 1.5 = 585px
                setImageHeight(calculatedHeight);
                console.log('🖼️ Image loaded:', {
                  sourceWidth: imageWidth,
                  sourceHeight: imageHeight,
                  expectedWidth: width,
                  aspectRatio: imageWidth / imageHeight,
                  calculatedHeight,
                });
                setImageLoaded(true);
              }}
              onLayout={(event) => {
                const { width: renderedWidth, height: renderedHeight } = event.nativeEvent.layout;
                console.log('🖼️ Image rendered layout:', {
                  renderedWidth,
                  renderedHeight,
                  expectedWidth: width,
                  expectedHeight: 1000,
                });
              }}
              fadeDuration={0}
            />
            {/* Gradient fade to black at bottom of image */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,1)']}
              style={styles.imageGradientFade}
            />
          </>
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: '#000000', height: height - 150 }]}>
            <Ionicons name="image-outline" size={64} color={theme.colors.text + '60'} />
          </View>
        )}
        
        {/* Loading overlay - only show if audio is loading AND image is not loaded yet */}
        {isLoading && !imageLoaded && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
          </View>
        )}
      </View>

      {/* Instagram Stories Style Progress Bars */}
      <View style={[styles.progressBarsContainer, { paddingTop: insets.top + 8 }]}>
        {scenes.map((_, index) => {
          const animValue = progressAnimations[index];
          const width = animValue
            ? animValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              })
            : '0%';
          
          return (
            <View key={index} style={styles.progressBarWrapper}>
              <View style={[styles.progressBarBackground, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <Animated.View
                  style={[
                    styles.progressBarForeground,
                    {
                      width: index < currentIndex ? '100%' : index === currentIndex ? width : '0%',
                      backgroundColor: '#FFFFFF',
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Skip Button */}
      {onClose && (
        <TouchableOpacity
          style={[styles.skipButton, { top: insets.top + 20, right: 0 }]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={[styles.skipButtonText, { fontFamily: theme.typography.body, color: theme.colors.text + '60' }]}>skip &gt;</Text>
        </TouchableOpacity>
      )}

      {/* Fixed Black Subtitle Section at Bottom */}
      <View style={[styles.subtitleSection, { paddingBottom: 50 + insets.bottom }]}>
        {/* Subtitle - Editorial Typography */}
        <View style={styles.subtitleContainer}>
          <Text style={[styles.subtitle, { fontFamily: theme.typography.body }]}>
            {(() => {
              const subtitleText = currentScene.voiceover || currentScene.text || '';
              // Split text into words while preserving spaces
              const parts = subtitleText.split(/(\s+)/);
              let wordIndex = -1;
              
              return parts.map((part, index) => {
                // If this part is a word (not just whitespace), increment word index
                if (part.trim().length > 0) {
                  wordIndex++;
                  const isHighlighted = wordIndex <= currentWordIndex;
                  return (
                    <Text
                      key={index}
                      style={{
                        color: isHighlighted ? theme.colors.text : theme.colors.text + '60',
                      }}
                    >
                      {part}
                    </Text>
                  );
                } else {
                  // Preserve whitespace
                  return <Text key={index}>{part}</Text>;
                }
              });
            })()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
    width: width,
  },
  tapAreasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 5,
  },
  tapArea: {
    flex: 1,
  },
  progressBarsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 4,
    gap: 4,
    zIndex: 10,
  },
  progressBarWrapper: {
    flex: 1,
    height: 2,
  },
  progressBarBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBarForeground: {
    height: '100%',
    borderRadius: 1,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    overflow: 'hidden',
  },
  image: {
    width: width,
    minWidth: width,
    maxWidth: width,
    alignSelf: 'stretch',
    flexShrink: 0,
    flexGrow: 0,
  },
  imageGradientFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  placeholderImage: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sceneNumberContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sceneNumber: {
    fontSize: 14,
    fontFamily: 'Merriweather_700Bold',
    letterSpacing: 1,
  },
  sceneNumberDivider: {
    width: 1,
    height: 12,
  },
  sceneTotal: {
    fontSize: 12,
    fontFamily: 'Merriweather_400Regular',
    letterSpacing: 0.5,
  },
  subtitleSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  subtitleContainer: {
    maxWidth: '100%',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    textAlign: 'center',
    opacity: 0.95,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Merriweather_400Regular',
  },
  skipButton: {
    position: 'absolute',
    paddingLeft: 16,
    paddingRight: 0,
    paddingVertical: 8,
    zIndex: 20,
  },
  skipButtonText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

