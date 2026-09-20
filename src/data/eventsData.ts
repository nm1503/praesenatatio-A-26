// ============================================================
// DATA: Events (Flagships + Domain Activities)
// ============================================================

export interface FlagshipEvent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  introduced: string;
  version?: string;
  emphasis: string[];
  timeline: { year: string; label: string }[];
  accentColor: string;
  type: 'flagship' | 'activity';
}

export const flagshipEvents: FlagshipEvent[] = [
  {
    id: 'nxgen-forum',
    name: 'NX-GEN FORUM',
    tagline: 'The future of diplomacy begins here.',
    description:
      'NX-Gen Forum is a modern UN-inspired simulation that challenges participants to think beyond conventional diplomacy and develop innovative ideas and solutions for emergency scenarios in the digital age. It is not about following procedure — it is about rewriting it.',
    introduced: "Aaruush'25",
    emphasis: ['Innovation', 'Diplomacy', 'Strategy', 'Emergency Response', 'Ideas'],
    timeline: [{ year: '2025', label: "Introduced at Aaruush'25" }],
    accentColor: '#1a5fa8',
    type: 'flagship',
  },
  {
    id: 'spotlight',
    name: 'SPOTLIGHT',
    tagline: 'Find your light. Own your stage.',
    description:
      'Spotlight is a multi-round creative platform designed to explore storytelling, scripts, acting and creativity while challenging participants across different stages of the competition. Each round peels back a new layer — of craft, of character, of courage.',
    introduced: '2024',
    version: 'Spotlight 2.0 — Aaruush\'25',
    emphasis: ['Storytelling', 'Scripts', 'Acting', 'Creativity', 'Performance'],
    timeline: [
      { year: '2024', label: 'Spotlight — First Edition' },
      { year: '2025', label: "Spotlight 2.0 — Aaruush'25" },
    ],
    accentColor: '#c9a84c',
    type: 'flagship',
  },
];

export interface DomainActivity {
  id: string;
  name: string;
  tagline: string;
  description: string;
  introduced: string;
  accentColor: string;
  stats: { label: string; value: number; sublabel?: string }[];
  highlights: { label: string; value: string | number }[];
  type: 'activity';
}

export const domainActivities: DomainActivity[] = [
  {
    id: 'fandom-forge',
    name: 'FANDOM FORGE',
    tagline: 'Where passion meets competition.',
    description:
      'Fandom Forge is a celebration of community, creativity and the cultures that form around the things we love. Built around five distinct fandoms, it brings together participants over three days to collaborate, compete and create — united by shared obsessions and the energy that comes from belonging.',
    introduced: '2025',
    accentColor: '#c9a84c',
    stats: [
      { label: 'Day 1', value: 63, sublabel: 'participants' },
      { label: 'Day 2', value: 60, sublabel: 'participants' },
      { label: 'Day 3', value: 48, sublabel: 'participants' },
      { label: 'Total', value: 171, sublabel: 'participants' },
    ],
    highlights: [
      { label: 'Fandoms', value: 5 },
      { label: 'Days', value: 3 },
      { label: 'Year Introduced', value: 2025 },
    ],
    type: 'activity',
  },
];
