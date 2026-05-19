'use client'

// viewBox: "0 0 1440 160", ground at y=160
// NSW uses fill-rule="evenodd" so the Opera House sails and Harbour Bridge arch
// opening are actual cutouts that show the gradient through the white silhouette.
// Other states use simple filled profiles.

// NSW outer silhouette + inner cutout sub-paths (all in one "d" attribute)
const NSW_PATH = [
  // ── Outer silhouette ──────────────────────────────────────────────────────
  'M0,160',
  'L0,140 L80,140 L80,130 L115,130 L115,120 L148,120 L148,112',
  'L178,112 L178,130 L196,130 L196,108',
  // Centrepoint Tower: base → disc → shaft → spire tip at y=2
  'L206,108 L206,78 L218,78 L218,58 L228,58',
  'L228,32 L233,32 L233,18 L235,8 L237,2 L239,8 L241,18 L241,32 L246,32',
  'L246,58 L256,58 L256,78 L268,78 L268,108 L282,108',
  // CBD buildings
  'L282,130 L296,130 L296,114 L312,114 L312,102 L335,102 L335,90',
  'L360,90 L360,79 L385,79 L385,68 L410,68 L410,79 L432,79',
  'L432,68 L455,68 L455,79 L478,79 L478,90 L488,90 L488,102 L488,128',
  // Opera House: solid block (y=55 → y=128) — sails are punched out below
  'L488,55 L640,55 L640,128',
  // Harbour Bridge: arch hump peaks at y≈5, base at y=128
  'C720,5 980,5 1080,128',
  // North Shore buildings
  'L1092,115 L1118,115 L1118,102 L1145,102 L1145,115 L1170,115',
  'L1170,126 L1200,126 L1200,134 L1242,134 L1242,142 L1310,142',
  'L1310,148 L1440,152 L1440,160 Z',

  // ── Opera House sail cutouts (evenodd → show gradient through) ────────────
  // Each sail: closed arch shape inside the Opera House block
  'M498,124 Q525,18 552,120 Z',   // sail 1 (tallest)
  'M554,120 Q582,16 608,116 Z',   // sail 2
  'M610,116 Q626,22 636,112 Z',   // sail 3 (smallest, nearest bridge)

  // ── Harbour Bridge arch opening (the big cutout inside the arch hump) ─────
  // Inner arch peaks at y≈32; outer arch peaks at y≈5 → 27-unit arch structure
  'M652,128 C730,32 988,32 1068,128 Z',
].join(' ')

const SKYLINES: Record<string, string> = {
  // Victoria: Eureka Tower stepped profile + Arts Centre triangular spire
  VIC: [
    'M0,160 L0,124 L78,124 L78,114 L118,114 L118,104 L152,104 L152,94',
    'L182,94 L182,82 L208,82 L208,67 L228,67 L228,54 L243,54 L243,42',
    'L255,42 L255,30 L265,30 L265,20 L275,20 L275,12 L280,12 L280,5',
    'L285,5 L285,12 L290,12 L290,20 L298,20 L298,30 L308,30',
    'L308,42 L318,42 L318,54 L333,54 L333,42 L350,42',
    'L350,30 L363,30 L363,42 L378,42 L378,56 L395,56',
    'L395,70 L415,70 L415,56 L435,56 L435,70 L455,70',
    'L455,82 L475,82 L475,70 L495,70 L495,82 L512,82 L512,120',
    'L516,120 L516,60 L519,50 L521,30 L523,16 L525,6 L527,16',
    'L529,30 L531,50 L534,60 L534,120 L538,120',
    'L538,82 L560,82 L560,72 L585,72 L585,82 L610,82 L610,92',
    'L642,92 L642,102 L685,102 L685,114 L738,114 L738,120',
    'L858,120 L858,124 L1058,124 L1058,128 L1314,128 L1440,128',
    'L1440,160 Z',
  ].join(' '),

  // Queensland: CBD skyline + Story Bridge cable silhouette
  QLD: [
    'M0,160 L0,124 L80,124 L80,114 L118,114 L118,104 L152,104 L152,94',
    'L180,94 L180,82 L208,82 L208,70 L232,70 L232,57 L255,57',
    'L255,44 L278,44 L278,34 L302,34 L302,44 L322,44',
    'L322,57 L342,57 L342,47 L365,47 L365,37 L388,37',
    'L388,50 L408,50 L408,60 L425,60',
    'L428,74 L442,87 L458,97 L472,102 L488,97 L502,87 L516,74 L519,60',
    'L540,60 L540,50 L562,50 L562,64 L585,64 L585,77 L610,77',
    'L610,90 L645,90 L645,102 L692,102 L692,114 L755,114 L755,120',
    'L858,120 L858,124 L1062,124 L1062,128 L1314,128 L1314,132 L1440,132',
    'L1440,160 Z',
  ].join(' '),

  // Western Australia: Bell Tower twin-sail shape + Perth CBD
  WA: [
    'M0,160 L0,126 L74,126 L74,116 L112,116 L112,106 L145,106 L145,96',
    'L172,96 L172,86 L196,86 L196,120 L210,120',
    'L210,68 L213,58 L215,42 L217,28 L219,14 L221,28',
    'L223,42 L226,55 L229,42 L231,28 L234,14 L236,28 L238,42 L241,58 L244,120',
    'L258,120 L258,86 L278,86 L278,74 L298,74',
    'L298,60 L322,60 L322,47 L348,47 L348,37 L372,37',
    'L372,50 L395,50 L395,62 L418,62 L418,76 L444,76 L444,90',
    'L475,90 L475,102 L520,102 L520,112 L570,112 L570,118',
    'L670,118 L670,122 L824,122 L824,126 L1026,126 L1026,130 L1228,130 L1228,134 L1440,134',
    'L1440,160 Z',
  ].join(' '),

  // South Australia: St Peter's Cathedral twin gothic spires + Adelaide CBD
  SA: [
    'M0,160 L0,124 L78,124 L78,114 L112,114 L112,104 L142,104 L142,94',
    'L168,94 L168,120 L182,120',
    'L182,60 L185,50 L187,32 L190,18 L192,6 L194,18 L197,32 L200,50 L203,60 L203,120',
    'L222,120',
    'L222,60 L225,50 L227,32 L230,18 L232,6 L234,18 L237,32 L240,50 L243,60 L243,120',
    'L258,120 L258,94 L278,94 L278,80 L302,80',
    'L302,67 L328,67 L328,57 L352,57 L352,67 L378,67',
    'L378,80 L405,80 L405,94 L435,94 L435,104 L470,104',
    'L470,114 L524,114 L524,120 L658,120 L658,124 L862,124 L862,128 L1112,128 L1112,132 L1440,132',
    'L1440,160 Z',
  ].join(' '),

  // Tasmania: Mount Wellington mountain silhouette
  TAS: [
    'M0,160 L0,78',
    'C100,62 220,48 360,52 C500,56 640,44 780,50 C920,56 1060,48 1200,58',
    'L1300,68 L1440,74',
    'L1440,160 Z',
  ].join(' '),

  // ACT: Parliament House hill + Black Mountain Tower spire
  ACT: [
    'M0,160 L0,124 L100,124 L100,118 L150,118 L150,112 L200,112 L200,106',
    'L260,106 L290,98 L360,88 L440,80 L510,74 L570,68 L608,64',
    'L628,64 L640,62 L660,66 L700,72 L760,82 L820,90 L860,98 L880,106',
    'L880,102 L895,102 L903,88 L909,66 L912,48 L915,32 L917,18 L919,8',
    'L921,18 L923,32 L926,48 L929,66 L935,88 L943,102 L960,102',
    'L975,100 L1010,94 L1048,90 L1082,88 L1118,90 L1155,94 L1190,100',
    'L1220,106 L1280,112 L1340,116 L1410,120 L1440,122',
    'L1440,160 Z',
  ].join(' '),

  // Northern Territory: Simple low tropical Darwin skyline
  NT: [
    'M0,160 L0,122 L80,122 L80,114 L120,114 L120,108 L155,108 L155,102',
    'L185,102 L185,96 L210,96 L210,90 L235,90 L235,82 L258,82',
    'L258,74 L275,74 L275,64 L293,64 L293,74 L312,74',
    'L312,84 L332,84 L332,96 L360,96 L360,102 L390,102',
    'L390,108 L425,108 L425,112 L485,112 L485,116',
    'L575,116 L575,120 L708,120 L708,122 L908,122 L908,126',
    'L1112,126 L1112,128 L1314,128 L1314,130 L1440,130',
    'L1440,160 Z',
  ].join(' '),
}

interface StateSkylineProps {
  state: string
}

export function StateSkyline({ state }: StateSkylineProps) {
  const isNSW = state === 'NSW' || !SKYLINES[state]

  return (
    <svg
      className="absolute bottom-0 w-full pointer-events-none select-none"
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ height: '40%', opacity: 0.22 }}
    >
      {isNSW ? (
        // evenodd punches the sail + arch cutouts through the white silhouette
        <path fill="white" fillRule="evenodd" d={NSW_PATH} />
      ) : (
        <path fill="white" d={SKYLINES[state]!} />
      )}
    </svg>
  )
}
