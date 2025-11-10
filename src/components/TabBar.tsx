import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabRouteName = 'Today' | 'Lives' | 'Profile';

interface TabConfig {
  name: TabRouteName;
  icon: string;
  translationKey: string;
}

const TABS: TabConfig[] = [
  { name: 'Lives', icon: 'people-outline', translationKey: 'lives' },
  { name: 'Today', icon: 'hourglass-outline', translationKey: 'today' },
  { name: 'Profile', icon: 'person-circle-outline', translationKey: 'profile' },
];

export default function TabBar() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const translateY = useRef(new Animated.Value(0)).current;
  const [shouldHideTabBar, setShouldHideTabBar] = React.useState(false);

  // Fallback for safe area insets
  const safeBottom = insets.bottom ?? 0;

  // Listen to navigation state changes to detect Montage or Protagonist screen
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const navigationState = navigation.getState();
      if (!navigationState) return;

      const activeTabIndex = navigationState.index ?? 0;
      const currentRoute = navigationState.routes[activeTabIndex];
      
      // Check if we're on the Montage, Protagonist, or Chapter screen
      let hideTabBar = false;
      if (currentRoute?.name === 'Lives' && currentRoute.state) {
        const focusedRoute = currentRoute.state.routes[currentRoute.state.index];
        hideTabBar = focusedRoute?.name === 'Montage' || focusedRoute?.name === 'Protagonist' || focusedRoute?.name === 'Chapter';
      }
      
      setShouldHideTabBar(hideTabBar);
    });

    // Check initial state
    const navigationState = navigation.getState();
    if (navigationState) {
      const activeTabIndex = navigationState.index ?? 0;
      const currentRoute = navigationState.routes[activeTabIndex];
      let hideTabBar = false;
      if (currentRoute?.name === 'Lives' && currentRoute.state) {
        const focusedRoute = currentRoute.state.routes[currentRoute.state.index];
        hideTabBar = focusedRoute?.name === 'Montage' || focusedRoute?.name === 'Protagonist' || focusedRoute?.name === 'Chapter';
      }
      setShouldHideTabBar(hideTabBar);
    }

    return unsubscribe;
  }, [navigation]);

  // Get current active tab from navigation state
  const navigationState = navigation.getState();
  const activeTabIndex = navigationState?.index ?? 0;
  const activeTabName = navigationState?.routes[activeTabIndex]?.name as TabRouteName;

  // Animate tab bar based on screen visibility
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: shouldHideTabBar ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [shouldHideTabBar, translateY]);

  const tabBarHeight = 90;
  const translateYValue = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabBarHeight + safeBottom],
  });

  const handleTabPress = (tabName: TabRouteName) => {
    navigation.navigate(tabName);
  };

  const styles = StyleSheet.create({
    tabBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      height: tabBarHeight,
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      paddingBottom: safeBottom,
      paddingTop: 8,
      zIndex: 1000,
      elevation: 10,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    tabLabel: {
      fontSize: 12,
      color: theme.colors.text + '80',
      fontFamily: theme.typography.body,
      fontWeight: '600',
      marginTop: 4,
    },
    activeTabLabel: {
      color: theme.colors.accent,
    },
  });

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          transform: [{ translateY: translateYValue }],
        },
      ]}
    >
      {TABS.map((tab) => {
        const isFocused = activeTabName === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => handleTabPress(tab.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isFocused ? theme.colors.accent : theme.colors.text + '80'}
            />
            <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>
              {t(`navigation.${tab.translationKey}`)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

