import { useId } from 'react';
import Svg, { ClipPath, Defs, Pattern, Rect } from 'react-native-svg';

const DEFAULT_COLOR = '#298E4E';

type DitherPillProps = {
  width: number;
  height: number;
  color?: string;
};

export function DitherPill({
  width,
  height,
  color = DEFAULT_COLOR,
}: DitherPillProps) {
  const uid = useId().replace(/\W/g, '');
  const r = height / 2;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Pattern
          id={`${uid}p`}
          x="0" y="0" width="6" height="6"
          patternUnits="userSpaceOnUse"
        >
          {/* No background rect — gaps are transparent */}
          <Rect x="0" y="0" width="1.5" height="1.5" fill={color} />
          <Rect x="3" y="0" width="1.5" height="1.5" fill={color} />
          <Rect x="0" y="3" width="1.5" height="1.5" fill={color} />
          <Rect x="3" y="3" width="1.5" height="1.5" fill={color} />
        </Pattern>
        <ClipPath id={`${uid}c`}>
          <Rect x="0" y="0" width={width} height={height} rx={r} ry={r} />
        </ClipPath>
      </Defs>
      <Rect
        width={width}
        height={height}
        fill={`url(#${uid}p)`}
        clipPath={`url(#${uid}c)`}
      />
    </Svg>
  );
}
