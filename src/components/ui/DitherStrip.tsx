import { useId } from 'react';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import { green } from '../../theme/colors';

type DitherStripProps = {
  height?: number;
  color?: string;
};

export function DitherStrip({ height = 6, color = green[200] }: DitherStripProps) {
  const uid = useId().replace(/\W/g, '');

  return (
    <Svg width="100%" height={height}>
      <Defs>
        <Pattern
          id={`${uid}p`}
          x="0" y="0" width="6" height="6"
          patternUnits="userSpaceOnUse"
        >
          {/* No background rect — gaps are transparent */}
          <Rect x="0" y="0" width="2" height="2" fill={color} />
          <Rect x="3" y="0" width="2" height="2" fill={color} />
          <Rect x="0" y="3" width="2" height="2" fill={color} />
          <Rect x="3" y="3" width="2" height="2" fill={color} />
        </Pattern>
      </Defs>
      <Rect width="100%" height={height} fill={`url(#${uid}p)`} />
    </Svg>
  );
}
