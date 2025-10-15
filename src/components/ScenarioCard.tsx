import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

interface ScenarioCardProps {
  title: string;
  subtitle: string;
  location: string;
  description: string;
  imageUrl?: string;
  onBegin: () => void;
}

export default function ScenarioCard({
  title,
  subtitle,
  location,
  description,
  imageUrl = 'bastille',
  onBegin,
}: ScenarioCardProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: 30,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      height: 535,
      backgroundColor: '#11171B',
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    imageBackground: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 550, // Half of the card height (500px)
    },
    contentContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.spacing.lg,
      justifyContent: 'flex-end',
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: 42,
      color: theme.colors.taupe,
      fontFamily: theme.typography.heading,
      textAlign: 'center',
      lineHeight: 46,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.taupe,
      fontFamily: theme.typography.heading,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    description: {
      fontSize: 14,
      color: theme.colors.taupe,
      fontFamily: theme.typography.body,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
      alignItems: 'center',
    },
    button: {
      borderWidth: 1,
      borderColor: theme.colors.taupe,
      borderRadius: 25,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      backgroundColor: 'transparent',
      minWidth: 200,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 14,
      color: theme.colors.taupe,
      fontFamily: theme.typography.body,
      fontWeight: '600',
      letterSpacing: 1,
    },
  });

  // Map imageUrl to actual image assets
  const getImageSource = (imageName: string) => {
    const images: { [key: string]: any } = {
      bastille: require('../../assets/bastille.png'),
      // Add more images here as they become available
    };
    return images[imageName] || images.bastille; // Fallback to bastille
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Background Image */}
        <ImageBackground
          source={getImageSource(imageUrl)}
          style={styles.imageBackground}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
          <LinearGradient
            colors={['#0f1419','#0f1419', 'transparent']}
            locations={[1, 0.75, 0]}
            style={styles.gradientOverlay}
          />
        
        {/* Content Container */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title.replace(/\\n/g, '\n')}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onBegin}>
              <Text style={styles.buttonText}>BEGIN SCENARIO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}