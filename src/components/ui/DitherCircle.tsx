import { useId } from 'react';
import Svg, { Circle, ClipPath, Defs, Pattern, Rect } from 'react-native-svg';

const DEFAULT_COLOR = '#298E4E';
const DEFAULT_BACKGROUND = '#C3EFD3';

type DitherCircleProps = {
  size?: number;
  color?: string;
  background?: string;
};

export function DitherCircle({
  size = 56,
  color = DEFAULT_COLOR,
  background = DEFAULT_BACKGROUND,
}: DitherCircleProps) {
  const uid = useId().replace(/\W/g, '');
  const r = size / 2;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <Pattern
          id={`${uid}p`}
          x="0" y="0" width="6" height="6"
          patternUnits="userSpaceOnUse"
        >
          <Rect width="6" height="6" fill={background} />
          <Rect x="0" y="0" width="1.5" height="1.5" fill={color} />
          <Rect x="3" y="0" width="1.5" height="1.5" fill={color} />
          <Rect x="0" y="3" width="1.5" height="1.5" fill={color} />
          <Rect x="3" y="3" width="1.5" height="1.5" fill={color} />
        </Pattern>
        <ClipPath id={`${uid}c`}>
          <Circle cx={r} cy={r} r={r} />
        </ClipPath>
      </Defs>
      <Rect
        width={size}
        height={size}
        fill={`url(#${uid}p)`}
        clipPath={`url(#${uid}c)`}
      />
    </Svg>
  );
}
