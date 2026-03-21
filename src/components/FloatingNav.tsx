import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from './Text';
import { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ITEMS: { label: string; route: keyof RootStackParamList }[] = [
  { label: 'List', route: 'Home' },
  { label: 'Library', route: 'Library' },
];

export function FloatingNav() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 12 + insets.bottom,
        left: 24,
        flexDirection: 'row',
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: '#171717',
      }}
    >
      {ITEMS.map((item, index) => {
        const isActive = route.name === item.route;
        const isLast = index === ITEMS.length - 1;

        return (
          <React.Fragment key={item.route}>
            <Pressable
              onPress={() => {
                if (!isActive) {
                  navigation.navigate(item.route);
                }
              }}
              style={({ pressed }) => ({
                paddingHorizontal: 20,
                paddingVertical: 14,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                className={isActive ? 'font-semibold' : 'font-medium'}
                style={{
                  color: isActive ? '#E2F8EA' : 'rgba(226,248,234,0.45)',
                  fontSize: 15,
                  lineHeight: 20,
                }}
              >
                {item.label}
              </Text>
            </Pressable>

            {!isLast && (
              <View
                style={{
                  width: 1,
                  marginVertical: 12,
                  backgroundColor: 'rgba(226,248,234,0.2)',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
