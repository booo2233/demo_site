import { useId } from "react";
import type { Colorway, Shape } from "@/data/products";

// Each lens is drawn as the LEFT lens centred on (0,0): negative x is the
// outer edge, positive x the nose side. The right lens is the same path
// mirrored. `bx`/`by` is where the bridge meets the lens, `ox` where the
// temple meets it.
const LENSES: Record<Shape, { d: string; bx: number; by: number; ox: number }> = {
  round: { d: "M -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0 Z", bx: 32, by: -10, ox: 33 },
  oval: { d: "M -42 0 a 42 29 0 1 0 84 0 a 42 29 0 1 0 -84 0 Z", bx: 40, by: -8, ox: 41 },
  rectangle: {
    d: "M -32 -24 H 32 Q 44 -24 44 -12 V 12 Q 44 24 32 24 H -32 Q -44 24 -44 12 V -12 Q -44 -24 -32 -24 Z",
    bx: 44,
    by: -10, ox: 44,
  },
  square: {
    d: "M -26 -31 H 26 Q 40 -31 40 -17 V 17 Q 40 31 26 31 H -26 Q -40 31 -40 17 V -17 Q -40 -31 -26 -31 Z",
    bx: 40,
    by: -12, ox: 40,
  },
  wayfarer: {
    d: "M -46 -30 Q -10 -32 40 -27 Q 47 -26 45 -16 L 37 16 Q 33 28 18 28 L -24 28 Q -38 28 -42 16 L -48 -20 Q -49 -29 -46 -30 Z",
    bx: 44,
    by: -14, ox: 47,
  },
  "cat-eye": {
    d: "M -50 -32 Q -20 -25 36 -23 Q 46 -22 44 -10 Q 40 18 18 26 Q 0 30 -20 24 Q -40 16 -44 -4 Q -48 -18 -50 -32 Z",
    bx: 44,
    by: -12, ox: 46,
  },
  aviator: {
    d: "M -40 -26 Q 0 -32 38 -24 Q 46 -22 44 -10 Q 40 20 10 32 Q -10 38 -28 28 Q -46 14 -46 -8 Q -46 -22 -40 -26 Z",
    bx: 44,
    by: -14, ox: 46,
  },
  browline: {
    d: "M -44 -22 H 42 Q 46 -22 45 -14 Q 42 14 24 24 Q 0 32 -26 24 Q -44 16 -45 -10 Q -46 -22 -44 -22 Z",
    bx: 45,
    by: -14, ox: 45,
  },
  hexagon: { d: "M -42 0 L -21 -30 L 21 -30 L 42 0 L 21 30 L -21 30 Z", bx: 35, by: -10, ox: 35 },
  sport: {
    d: "M -52 -18 Q -20 -32 40 -22 Q 48 -20 46 -8 Q 42 16 20 22 Q -10 28 -36 18 Q -54 8 -52 -18 Z",
    bx: 45,
    by: -14, ox: 52,
  },
};

const LX = 68;
const RX = 172;
const CY = 50;

export function FrameArt({
  shape,
  color,
  material = "",
  className,
}: {
  shape: Shape;
  color: Colorway;
  material?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const lens = LENSES[shape];
  const isMetal = /metal|titanium|steel/i.test(material) && !/acetate/i.test(material);
  const stroke = isMetal ? 3 : shape === "sport" ? 6 : 6.5;
  const bridgeY = CY + lens.by;
  const x1 = LX + lens.bx;
  const x2 = RX - lens.bx;
  const templeX = lens.ox;

  return (
    <svg viewBox="0 0 240 100" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`tint-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color.lens} stopOpacity={Math.min(1, color.lensOpacity + 0.08)} />
          <stop offset="1" stopColor={color.lens} stopOpacity={color.lensOpacity * 0.7} />
        </linearGradient>
        <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`frame-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color.frame} />
          <stop offset="1" stopColor={color.frame} stopOpacity="0.82" />
        </linearGradient>
        <filter id={`shadow-${id}`} x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0b1020" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${id})`}>
        {/* temples */}
        <path
          d={`M ${LX - templeX + 2} ${bridgeY} L 4 ${bridgeY - 4}`}
          stroke={`url(#frame-${id})`}
          strokeWidth={stroke * 0.8}
          strokeLinecap="round"
        />
        <path
          d={`M ${RX + templeX - 2} ${bridgeY} L 236 ${bridgeY - 4}`}
          stroke={`url(#frame-${id})`}
          strokeWidth={stroke * 0.8}
          strokeLinecap="round"
        />

        {/* bridge (aviators get a second, straight brow bar) */}
        <path
          d={`M ${x1 - 1} ${bridgeY} Q 120 ${bridgeY - 12} ${x2 + 1} ${bridgeY}`}
          fill="none"
          stroke={`url(#frame-${id})`}
          strokeWidth={isMetal ? 3 : stroke * 0.9}
          strokeLinecap="round"
        />
        {shape === "aviator" && (
          <path
            d={`M ${LX + 20} ${CY - 28} L ${RX - 20} ${CY - 28}`}
            stroke={`url(#frame-${id})`}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}

        {[LX, RX].map((cx, i) => (
          <g key={cx} transform={`translate(${cx} ${CY}) scale(${i ? -1 : 1} 1)`}>
            <path d={lens.d} fill={`url(#tint-${id})`} />
            <path d={lens.d} fill={`url(#shine-${id})`} />
            <path
              d={lens.d}
              fill="none"
              stroke={`url(#frame-${id})`}
              strokeWidth={stroke}
              strokeLinejoin="round"
            />
            {shape === "browline" && (
              <path
                d="M -46 -22 H 44 Q 47 -22 46 -15"
                fill="none"
                stroke={`url(#frame-${id})`}
                strokeWidth={9}
                strokeLinecap="round"
              />
            )}
            {/* specular glint */}
            <path
              d="M -20 -14 Q -12 -20 -2 -20"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
