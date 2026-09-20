// ============================================================
// DATA: Domains
// To edit descriptions or names, change them here.
// ============================================================

export interface Domain {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  keywords: string[];
}

export const domains: Domain[] = [
  {
    id: 'dramatics',
    name: 'DRAMATICS',
    tagline: 'Where silence becomes spectacle.',
    description:
      'Dramatics is the stage where emotion transcends language. Through performance, acting and theatrical storytelling, participants inhabit characters and worlds beyond their own — turning rehearsed moments into raw, electric truth. It is the oldest form of human communication, reborn every night under the lights.',
    color: '#c0392b',
    keywords: ['Performance', 'Acting', 'Theatre', 'Storytelling', 'Emotion'],
  },
  {
    id: 'literature',
    name: 'LITERATURE',
    tagline: 'Every word a world.',
    description:
      'Literature is where thought finds permanence. It is the art of choosing words with intent — to create, provoke, imagine and endure. From poetry to prose, from critical writing to creative fiction, Literature at Praesentatio is a space for those who believe that a well-placed sentence can change how someone sees the world.',
    color: '#2e8b57',
    keywords: ['Writing', 'Poetry', 'Prose', 'Creativity', 'Expression'],
  },
  {
    id: 'oration',
    name: 'ORATION',
    tagline: 'Ideas that demand to be heard.',
    description:
      'Oration is the art of wielding voice with purpose. In debate, in persuasion, in the carefully constructed argument — Oration trains participants to stand before an audience and compel them to listen. It is not just about speaking; it is about having something worth saying and saying it in a way that cannot be ignored.',
    color: '#1a5fa8',
    keywords: ['Debate', 'Persuasion', 'Public Speaking', 'Ideas', 'Rhetoric'],
  },
];
