export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const STRING_LABELS = ['6', '5', '4', '3', '2', '1'];
export const STRING_NAMES = ['Low E', 'A', 'D', 'G', 'B', 'High E'];
export const STRING_THICKNESS = [2.8, 2.3, 1.9, 1.5, 1.1, 0.8];

export const PEG_POSITIONS = [
    { x: 28,  y: 254 },
    { x: 28,  y: 168 },
    { x: 28,  y: 82  },
    { x: 232, y: 82  },
    { x: 232, y: 168 },
    { x: 232, y: 254 },
];

export const STRING_NUT_X = [100, 112, 124, 136, 148, 160];
export const DEFAULT_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

export interface TuningPreset {
    name: string;
    notes: string[];
    category: 'standard' | 'drop' | 'open' | 'alternate';
    description: string;
    artist?: string;
}

export const POPULAR_TUNINGS: TuningPreset[] = [
    { name: 'Standard',        notes: ['E', 'A', 'D', 'G', 'B', 'E'],    category: 'standard',  description: 'E A D G B E — Universal starting point' },
    { name: 'Eb Standard',     notes: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'], category: 'standard', description: 'Eb Ab Db Gb Bb Eb', artist: 'Hendrix, SRV, Nirvana' },
    { name: 'D Standard',      notes: ['D', 'G', 'C', 'F', 'A', 'D'],    category: 'standard',  description: 'D G C F A D — Full step down', artist: 'Mastodon, Alice in Chains' },
    { name: 'C Standard',      notes: ['C', 'F', 'A#', 'D#', 'G', 'C'],  category: 'standard',  description: 'C F Bb Eb G C — Two steps down', artist: 'Slayer, Devin Townsend' },
    { name: 'Drop D',          notes: ['D', 'A', 'D', 'G', 'B', 'E'],    category: 'drop',      description: 'D A D G B E — Classic power chords', artist: 'Nirvana, Foo Fighters' },
    { name: 'Drop C',          notes: ['C', 'G', 'C', 'F', 'A', 'D'],    category: 'drop',      description: 'C G C F A D — Heavy metal staple', artist: 'System of a Down' },
    { name: 'Drop B',          notes: ['B', 'F#', 'B', 'E', 'G#', 'C#'], category: 'drop',      description: 'B F# B E G# C# — Extra heavy', artist: 'Avenged Sevenfold' },
    { name: 'Drop A',          notes: ['A', 'E', 'A', 'D', 'F#', 'B'],   category: 'drop',      description: 'A E A D F# B — Extreme low', artist: 'Korn, Animals as Leaders' },
    { name: 'Open G',          notes: ['D', 'G', 'D', 'G', 'B', 'D'],    category: 'open',      description: 'D G D G B D — Blues & slide', artist: 'Keith Richards, Robert Johnson' },
    { name: 'Open D',          notes: ['D', 'A', 'D', 'F#', 'A', 'D'],   category: 'open',      description: 'D A D F# A D — Folk & blues', artist: 'Joni Mitchell, Bob Dylan' },
    { name: 'Open E',          notes: ['E', 'B', 'E', 'G#', 'B', 'E'],   category: 'open',      description: 'E B E G# B E — Slide guitar classic', artist: 'Duane Allman, Derek Trucks' },
    { name: 'Open A',          notes: ['E', 'A', 'E', 'A', 'C#', 'E'],   category: 'open',      description: 'E A E A C# E — Country & blues slide' },
    { name: 'Open C',          notes: ['C', 'G', 'C', 'G', 'C', 'E'],    category: 'open',      description: 'C G C G C E — Rich open voicing', artist: 'Nick Drake' },
    { name: 'DADGAD',          notes: ['D', 'A', 'D', 'G', 'A', 'D'],    category: 'alternate', description: 'D A D G A D — Celtic modal', artist: 'Jimmy Page, Pierre Bensusan' },
    { name: 'New Standard',    notes: ['C', 'G', 'D', 'A', 'E', 'G'],    category: 'alternate', description: 'C G D A E G — Wide range tuning', artist: 'Robert Fripp' },
    { name: 'Double Drop D',   notes: ['D', 'A', 'D', 'G', 'B', 'D'],    category: 'alternate', description: 'D A D G B D — Both E strings to D', artist: 'Neil Young' },
];

export type Category = 'all' | 'standard' | 'drop' | 'open' | 'alternate';

export const CATEGORY_LABELS: Record<Category, string> = {
    all: 'All',
    standard: 'Standard',
    drop: 'Drop',
    open: 'Open',
    alternate: 'Alternate',
};