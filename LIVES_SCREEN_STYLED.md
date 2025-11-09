# Lives Screen - Styled Like Anime Browser

The Lives screen has been updated with a modern, poster-style layout inspired by anime browsing interfaces.

## Key Design Changes

### Screen Layout
✅ **Header Bar**
- Title "Lives" on the left (large, bold)
- Search icon on the right
- Clean, minimal design with SafeAreaView

✅ **Section Header**
- "Recently Added" label
- Filter icon (options-outline)
- Sort icon (swap-vertical-outline)
- Aligned horizontally with icons on the right

✅ **Grid Layout**
- 2-column grid of protagonist posters
- Portrait orientation (3:2 aspect ratio)
- Responsive to screen width

### Card Design (ProtagonistCard)
✅ **Poster Style**
- Tall, portrait-oriented cards (like movie posters)
- Full-bleed images with rounded corners
- Gradient overlay at the bottom of images
- Clean, minimal aesthetic

✅ **Info Section Below Poster**
- Name displayed below the poster (1 line, truncated)
- Metadata: `Lifespan | Archetype` format
- Three-dot menu icon on the right
- Compact, readable layout

### Visual Features
- **LinearGradient**: Dark gradient overlay on bottom of posters
- **Ionicons**: Filter, sort, search, and menu icons
- **Theme-aware**: All colors use theme system
- **Accent color**: Used for loading indicators
- **Typography**: Consistent font sizing and weights

## Component Updates

### LivesScreen.tsx
```typescript
// New imports
import SafeAreaView from 'react-native'
import StatusBar from 'react-native'
import Ionicons from '@expo/vector-icons'

// New header with search icon
<View style={styles.header}>
  <Text>Lives</Text>
  <Ionicons name="search-outline" />
</View>

// Section header with filter/sort
<View style={styles.sectionHeader}>
  <Text>Recently Added</Text>
  <Ionicons name="options-outline" />
  <Ionicons name="swap-vertical-outline" />
</View>
```

### ProtagonistCard.tsx
```typescript
// New imports
import LinearGradient from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons'

// Poster container with gradient
<TouchableOpacity style={styles.posterContainer}>
  <Image source={coverImage} />
  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} />
</TouchableOpacity>

// Info below poster
<View style={styles.infoContainer}>
  <Text>{name}</Text>
  <Text>{lifespan} | {archetypes}</Text>
  <Ionicons name="ellipsis-vertical" />
</View>
```

## Dimensions
- **Card Width**: `(screenWidth - 32) / 2`
- **Card Height**: `cardWidth * 1.5` (3:2 aspect ratio)
- **Spacing**: Consistent padding and margins

## Theme Integration
All colors use the theme system:
- `theme.colors.background` - Screen background
- `theme.colors.text` - Primary text
- `theme.colors.text + '80'` - Secondary text (50% opacity)
- `theme.colors.text + '60'` - Tertiary text (40% opacity)
- `theme.colors.accent` - Loading indicators
- `theme.colors.surface` - Card backgrounds (placeholders)

## Translations Added
All languages now include:
- `lives.recently_enabled`
  - EN: "Recently Added"
  - ES: "Habilitadas Recientemente"
  - FR: "Récemment Activées"
  - DE: "Kürzlich Aktiviert"
  - ZH: "最近启用"

## Dependencies Used
- ✅ `expo-linear-gradient` - Already installed
- ✅ `@expo/vector-icons` - Already installed
- ✅ SafeAreaView - Built into React Native
- ✅ StatusBar - Built into React Native

## Visual Hierarchy
1. **Header** - Bold title, search action
2. **Section Header** - Context label, filter/sort actions
3. **Grid** - Prominent visual posters
4. **Info** - Subtle text below each poster
5. **Actions** - Menu dots for each item

## User Experience
- **Touch targets**: All interactive elements are properly sized
- **Pull to refresh**: Maintains functionality
- **Loading states**: Centered spinner with message
- **Empty states**: Helpful messages with retry button
- **Error states**: Clear error messages with retry option

## Next Steps
The backend API needs to be fixed (Prisma query error with archetype filtering). Once that's resolved, the Lives screen will display real protagonist data with this beautiful new layout! 🎨

## Preview
The design matches modern streaming app browse interfaces:
- Clean header with search
- Section headers with actions
- Tall poster cards in a grid
- Metadata below each poster
- Menu options for each item

