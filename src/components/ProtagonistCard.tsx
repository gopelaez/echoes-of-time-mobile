import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Protagonist } from '../types/protagonist';
import { useTheme } from '../theme/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

interface ProtagonistCardProps {
  protagonist: Protagonist;
  onPress?: (protagonist: Protagonist) => void;
}

export const ProtagonistCard: React.FC<ProtagonistCardProps> = ({ protagonist, onPress }) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  
  // Calculate card width to fit 2 cards perfectly:
  // Screen width - listContent padding (8*2) - row padding (0*2) - gap between cards (10)
  const CARD_WIDTH = (width - 16 - 0 - 10) / 2; // = (width - 26) / 2
  const CARD_HEIGHT = CARD_WIDTH * 1.4; // Slightly reduced aspect ratio

  const getChapterCount = () => {
    // Only use chapterCount if provided directly from API
    if (protagonist.chapterCount !== undefined && protagonist.chapterCount !== null) {
      return protagonist.chapterCount;
    }
    return null;
  };

  return (
    <View style={[styles.container, { width: CARD_WIDTH }]}>
      {/* Poster Card */}
      <TouchableOpacity
        style={[styles.posterContainer, { height: CARD_HEIGHT }]}
        onPress={() => onPress?.(protagonist)}
        activeOpacity={0.9}
      >
        {/* Cover Image */}
        {protagonist.coverImage || protagonist.protagonistPortraitUrl ? (
          <Image
            source={{ uri: protagonist.coverImage || protagonist.protagonistPortraitUrl || '' }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.placeholderText, { color: theme.colors.text + '60' }]}>
              {protagonist.name.charAt(0)}
            </Text>
          </View>
        )}
        
        {/* Gradient Overlay at bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
      </TouchableOpacity>

      {/* Info Below Poster */}
      <View style={styles.infoContainer}>
        {/* Name */}
        <Text
          style={[styles.name, { color: theme.colors.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {protagonist.name}
        </Text>
        
        {/* Chapter Count */}
        {getChapterCount() !== null && getChapterCount()! > 0 && (
          <Text
            style={[styles.category, { color: theme.colors.text + '60' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getChapterCount() === 1 ? '1 Chapter' : `${getChapterCount()} Chapters`}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  posterContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  infoContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
  },
});

