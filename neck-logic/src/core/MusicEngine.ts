import { FretboardNote } from '../components/Fretboard';

export const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const INTERVAL_LABELS = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'] as const;

const NOTE_INDEX_MAP = new Map<string, number>(CHROMATIC_SCALE.map((note, index) => [note, index]));

export interface ScaleDef {
    name: string;
    intervals: number[];
    formula: string;
}

export const SCALES: Record<string, ScaleDef> = {
    major: { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11], formula: '1 - 2 - 3 - 4 - 5 - 6 - 7' },
    minor: { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10], formula: '1 - 2 - ♭3 - 4 - 5 - ♭6 - ♭7' },
    pentatonicMajor: { name: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9], formula: '1 - 2 - 3 - 5 - 6' },
    pentatonicMinor: { name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10], formula: '1 - ♭3 - 4 - 5 - ♭7' },
    dorian: { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], formula: '1 - 2 - ♭3 - 4 - 5 - 6 - ♭7' },
} as const;

export const TUNINGS: Record<string, string[]> = {
    STANDARD: ['E', 'A', 'D', 'G', 'B', 'E'],
    DROP_D: ['D', 'A', 'D', 'G', 'B', 'E'],
    HALF_STEP_DOWN: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'],
    OPEN_G: ['D', 'G', 'D', 'G', 'B', 'D']
} as const;

export function getNoteAtFret(openNote: string, fret: number): string {
    const openIndex = NOTE_INDEX_MAP.get(openNote.toUpperCase());
    if (openIndex === undefined) return '';

    return CHROMATIC_SCALE[(openIndex + fret) % 12];
}

export function getNoteFromStringAndFret(stringNum: number, fret: number, tuning: string[]): string {
    const arrayIndex = tuning.length - stringNum;
    return getNoteAtFret(tuning[arrayIndex], fret);
}

export function getFretboardPositionsForNotes(
  targetNotes: string[],
  tuning: string[] = TUNINGS.STANDARD,
  maxFrets: number = 22,
  defaultColor: string = '#00D9FF',
  rootNote?: string,
  rootColor: string = '#A855F7'
): FretboardNote[] {
    const positions: FretboardNote[] = [];
    const targetSet = new Set(targetNotes.map(n => n.toUpperCase()));
    const rootUpper = rootNote?.toUpperCase();
    const totalStrings = tuning.length;

    for (let stringIndex = 0; stringIndex < totalStrings; stringIndex++) {
        const stringNum = totalStrings - stringIndex;
        const openNote = tuning[stringIndex];

        for (let fret = 0; fret <= maxFrets; fret++) {
            const currentNote = getNoteAtFret(openNote, fret);

            if (targetSet.has(currentNote)) {
                positions.push({
                    string: stringNum,
                    fret,
                    label: currentNote,
                    color: currentNote === rootUpper ? rootColor : defaultColor
                });
            }
        }
    }

    return positions;
}