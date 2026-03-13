import { Text as RNText, TextProps, StyleSheet } from 'react-native';

const weightToFamily: Record<string, string> = {
  '400': 'WorkSans_400Regular',
  '500': 'WorkSans_500Medium',
  '600': 'WorkSans_600SemiBold',
  '700': 'WorkSans_700Bold',
  normal: 'WorkSans_400Regular',
  bold: 'WorkSans_700Bold',
};

const classToFamily: Record<string, string> = {
  'font-medium': 'WorkSans_500Medium',
  'font-semibold': 'WorkSans_600SemiBold',
  'font-bold': 'WorkSans_700Bold',
};

export function Text({ style, className, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  const weight = flat.fontWeight as string | undefined;

  let fontFamily = weightToFamily[weight ?? ''] ?? 'WorkSans_500Medium';

  if (className) {
    for (const [cls, family] of Object.entries(classToFamily)) {
      if (className.includes(cls)) {
        fontFamily = family;
        break;
      }
    }
  }

  const resolvedStyle = [{ fontFamily }, style];

  return <RNText style={resolvedStyle} className={className} {...props} />;
}
