import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Defs, Pattern } from 'react-native-svg';
import { green } from '../../theme/colors';

const DEFAULT_COLOR = green[400];
const DEFAULT_BACKGROUND = green[200];

type DitherFadeProps = {
  height?: number;
  color?: string;
  background?: string;
  direction?: 'up' | 'down';
  className?: string;
};

const PATTERNS = {
  d: { w: 6,  h: 6,  dots: [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 3 }] },
  m: { w: 8,  h: 8,  dots: [{ x: 0, y: 0 }, { x: 4, y: 4 }] },
  s: { w: 14, h: 14, dots: [{ x: 0, y: 0 }, { x: 7, y: 7 }] },
} as const;

type Density = keyof typeof PATTERNS;

// Round h up to the nearest multiple of the pattern tile height
// so no partial rows appear at zone boundaries
function snapToTile(desiredHeight: number, density: Density): number {
  const tileH = PATTERNS[density].h;
  return Math.ceil(desiredHeight / tileH) * tileH;
}

export function DitherFade({
  height = 40,
  color = DEFAULT_COLOR,
  background = DEFAULT_BACKGROUND,
  direction = 'up',
  className,
}: DitherFadeProps) {
  const uid = useId().replace(/\W/g, '');

  const targetZoneH = Math.floor(height / 3);

  // Snap each zone height to a clean tile multiple
  const denseH  = snapToTile(Math.floor(targetZoneH * 2 / 3), 'd');
  const mediumH = snapToTile(targetZoneH, 'm');
  const sparseH = snapToTile(targetZoneH, 's');
  const totalH  = denseH + mediumH + sparseH;

  const densities: Density[] = direction === 'up'
    ? ['d', 'm', 's']
    : ['s', 'm', 'd'];

  const heights = [denseH, mediumH, sparseH];

  const zones = densities.map((p, i) => ({
    p,
    h: heights[i],
    y: heights.slice(0, i).reduce((a, b) => a + b, 0),
  }));

  return (
    <View style={{ height: totalH, overflow: 'hidden' }} className={className}>
      <Svg width="100%" height={totalH} preserveAspectRatio="none">
        <Defs>
          {zones.map((zone, i) => {
            const cfg = PATTERNS[zone.p];
            return (
              <Pattern
                key={i}
                id={`${uid}${i}`}
                x={0}
                y={zone.y}
                width={cfg.w}
                height={cfg.h}
                patternUnits="userSpaceOnUse"
              >
                <Rect width={cfg.w} height={cfg.h} fill={background} />
                {cfg.dots.map((dot, j) => (
                  <Rect key={j} x={dot.x} y={dot.y} width="1.5" height="1.5" fill={color} />
                ))}
              </Pattern>
            );
          })}
        </Defs>

        <Rect width="100%" height={totalH} fill={background} />

        {zones.map((zone, i) => (
          <Rect
            key={i}
            y={zone.y}
            width="100%"
            height={zone.h}
            fill={`url(#${uid}${i})`}
          />
        ))}
      </Svg>
    </View>
  );
}