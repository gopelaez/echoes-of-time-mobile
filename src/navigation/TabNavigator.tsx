import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import TabBar from '../components/TabBar';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import { LivesScreen } from '../screens/LivesScreen';
import { MontageScreen } from '../screens/MontageScreen';
import { ProtagonistScreen } from '../screens/ProtagonistScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Lives tab
function LivesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="LivesList" component={LivesScreen} />
      <Stack.Screen name="Montage" component={MontageScreen} />
      <Stack.Screen name="Protagonist" component={ProtagonistScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Tab.Navigator
        initialRouteName="Today"
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
      <Tab.Screen 
        name="Lives"
        component={LivesStack}
        options={{
          title: t('navigation.lives'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Today" 
        component={HomeScreen}
        options={{
          title: t('navigation.today'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      </Tab.Navigator>
      <TabBar />
    </>
  );
}
