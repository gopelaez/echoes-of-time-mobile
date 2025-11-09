import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MontagePlayer } from '../components/MontagePlayer';
import { fetchProtagonistDetail, getMontageScenes } from '../services/protagonistService';
import { ProtagonistDetail, MontageScene } from '../types/protagonist';
import { useLanguage } from '../store/LanguageContext';
import { useTheme } from '../theme/ThemeProvider';

type RootStackParamList = {
  Montage: { personId: number };
  Protagonist: { personId: number };
};

type MontageScreenRouteProp = RouteProp<RootStackParamList, 'Montage'>;
type MontageScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Montage'>;

export const MontageScreen: React.FC = () => {
  const route = useRoute<MontageScreenRouteProp>();
  const navigation = useNavigation<MontageScreenNavigationProp>();
  const { currentLanguage } = useLanguage();
  const { theme } = useTheme();
  
  const { personId } = route.params;
  
  const [protagonist, setProtagonist] = useState<ProtagonistDetail | null>(null);
  const [scenes, setScenes] = useState<MontageScene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProtagonistDetail();
  }, [personId, currentLanguage]);

  const loadProtagonistDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchProtagonistDetail(personId, currentLanguage);
      setProtagonist(data);
      
      const montageScenes = getMontageScenes(data);
      setScenes(montageScenes);
      
      if (montageScenes.length === 0) {
        // No montage scenes, go directly to protagonist screen
        navigation.replace('Protagonist', { personId });
      }
    } catch (err) {
      console.error('Failed to load protagonist detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to load protagonist');
    } finally {
      setLoading(false);
    }
  };

  const handleMontageComplete = () => {
    navigation.replace('Protagonist', { personId });
  };

  const handleClose = () => {
    handleMontageComplete();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>{error}</Text>
      </View>
    );
  }

  if (scenes.length === 0) {
    // This shouldn't happen due to check above, but just in case
    handleMontageComplete();
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <MontagePlayer
        scenes={scenes}
        onComplete={handleMontageComplete}
        showSkip={true}
        onClose={handleClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

