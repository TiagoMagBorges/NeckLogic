import { FretboardNote } from '../components/Fretboard';

export const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export type Note = typeof CHROMATIC_SCALE[number];

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

export interface ChordQualityDef {
    name: string;
    intervals: number[];
}

export const CHORD_QUALITIES: Record<string, ChordQualityDef> = {
    major: { name: 'Maior', intervals: [0, 4, 7] },
    minor: { name: 'Menor', intervals: [0, 3, 7] },
    maj7: { name: 'Maior com 7ª maior', intervals: [0, 4, 7, 11] },
    min7: { name: 'Menor com 7ª menor', intervals: [0, 3, 7, 10] },
    dom7: { name: 'Dominante (7ª menor)', intervals: [0, 4, 7, 10] },
    dim: { name: 'Diminuta', intervals: [0, 3, 6] },
    aug: { name: 'Aumentada', intervals: [0, 4, 8] },
    sus2: { name: 'Suspensa 2ª', intervals: [0, 2, 7] },
    sus4: { name: 'Suspensa 4ª', intervals: [0, 5, 7] },
} as const;

export function getChordNotes(root: string, quality: string): string[] {
    const rootIndex = NOTE_INDEX_MAP.get(root.toUpperCase());
    const def = CHORD_QUALITIES[quality];
    if (rootIndex === undefined || !def) return [];

    return def.intervals.map(interval => CHROMATIC_SCALE[(rootIndex + interval) % 12]);
}

export interface HarmonicDegree {
    degree: string;
    root: string;
    quality: string;
}

const MAJOR_FIELD_DEGREES = [
    { numeral: 'I', quality: 'major' },
    { numeral: 'ii', quality: 'minor' },
    { numeral: 'iii', quality: 'minor' },
    { numeral: 'IV', quality: 'major' },
    { numeral: 'V', quality: 'major' },
    { numeral: 'vi', quality: 'minor' },
    { numeral: 'vii°', quality: 'dim' },
];

const MINOR_FIELD_DEGREES = [
    { numeral: 'i', quality: 'minor' },
    { numeral: 'ii°', quality: 'dim' },
    { numeral: 'III', quality: 'major' },
    { numeral: 'iv', quality: 'minor' },
    { numeral: 'v', quality: 'minor' },
    { numeral: 'VI', quality: 'major' },
    { numeral: 'VII', quality: 'major' },
];

export function getHarmonicField(root: string, mode: 'major' | 'minor'): HarmonicDegree[] {
    const rootIndex = NOTE_INDEX_MAP.get(root.toUpperCase());
    const scale = SCALES[mode];
    if (rootIndex === undefined || !scale) return [];

    const degrees = mode === 'major' ? MAJOR_FIELD_DEGREES : MINOR_FIELD_DEGREES;

    return scale.intervals.map((interval, i) => ({
        degree: degrees[i].numeral,
        root: CHROMATIC_SCALE[(rootIndex + interval) % 12],
        quality: degrees[i].quality,
    }));
}

export function getRelativeKey(root: string, mode: 'major' | 'minor'): { root: string; mode: 'major' | 'minor' } {
    const rootIndex = NOTE_INDEX_MAP.get(root.toUpperCase());
    if (rootIndex === undefined) return { root, mode: mode === 'major' ? 'minor' : 'major' };

    if (mode === 'major') {
        return { root: CHROMATIC_SCALE[(rootIndex + 9) % 12], mode: 'minor' };
    }
    return { root: CHROMATIC_SCALE[(rootIndex + 3) % 12], mode: 'major' };
}

export const CIRCLE_OF_FIFTHS: string[] = Array.from(
  { length: 12 },
  (_, i) => CHROMATIC_SCALE[(i * 7) % 12]
);

export type ChordFunction = 'tonic' | 'subdominant' | 'dominant';

const FUNCTION_BY_DEGREE_INDEX: ChordFunction[] = [
    'tonic', 'subdominant', 'tonic', 'subdominant', 'dominant', 'tonic', 'dominant'
];

export function getChordFunction(degreeIndex: number): ChordFunction {
    return FUNCTION_BY_DEGREE_INDEX[degreeIndex] ?? 'tonic';
}

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

const STANDARD_OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64];

export function getOpenStringMidi(stringIndex: number, openNote: string): number {
    const noteIndex = NOTE_INDEX_MAP.get(openNote.toUpperCase());
    const anchor = STANDARD_OPEN_STRING_MIDI[stringIndex] ?? STANDARD_OPEN_STRING_MIDI[0];
    if (noteIndex === undefined) return anchor;

    const anchorOctave = Math.floor(anchor / 12);
    let candidate = anchorOctave * 12 + noteIndex;

    if (candidate - anchor > 6) candidate -= 12;
    if (anchor - candidate > 6) candidate += 12;

    return candidate;
}

export function getMidiNote(stringNum: number, fret: number, tuning: string[]): number {
    const arrayIndex = tuning.length - stringNum;
    return getOpenStringMidi(arrayIndex, tuning[arrayIndex]) + fret;
}

export function getIntervalName(fromNote: string, toNote: string): string {
    const fromIndex = NOTE_INDEX_MAP.get(fromNote.toUpperCase());
    const toIndex = NOTE_INDEX_MAP.get(toNote.toUpperCase());
    if (fromIndex === undefined || toIndex === undefined) return '';

    const distance = (toIndex - fromIndex + 12) % 12;
    return INTERVAL_LABELS[distance];
}

const NATURAL_NOTE_ORDER = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export type Accidental = 'natural' | 'sharp' | 'flat';

export interface ParsedNote {
    letter: string;
    accidental: Accidental;
    octave: number;
}

export function parseNoteWithOctave(noteWithOctave: string): ParsedNote {
    const match = /^([A-Ga-g])(#|b)?(-?\d+)$/.exec(noteWithOctave.trim());
    if (!match) return { letter: 'C', accidental: 'natural', octave: 4 };

    const [, letter, accidentalSymbol, octaveStr] = match;
    const accidental: Accidental = accidentalSymbol === '#' ? 'sharp' : accidentalSymbol === 'b' ? 'flat' : 'natural';

    return { letter: letter.toUpperCase(), accidental, octave: parseInt(octaveStr, 10) };
}

export type ClefType = 'treble' | 'bass';

// The natural note sitting on each clef's bottom staff line (staff step 0).
const CLEF_BOTTOM_LINE_NOTE: Record<ClefType, { letter: string; octave: number }> = {
    treble: { letter: 'E', octave: 4 },
    bass: { letter: 'G', octave: 2 },
};

export function getStaffStep(noteWithOctave: string, clef: ClefType = 'treble'): number {
    const { letter, octave } = parseNoteWithOctave(noteWithOctave);
    const reference = CLEF_BOTTOM_LINE_NOTE[clef];
    const letterIndex = NATURAL_NOTE_ORDER.indexOf(letter);
    const referenceIndex = NATURAL_NOTE_ORDER.indexOf(reference.letter);

    return (octave - reference.octave) * 7 + (letterIndex - referenceIndex);
}

export type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

const DURATION_BEATS: Record<NoteDuration, number> = {
    whole: 4,
    half: 2,
    quarter: 1,
    eighth: 0.5,
    sixteenth: 0.25,
};

export function getDurationBeats(duration: NoteDuration, dotted = false): number {
    const base = DURATION_BEATS[duration];
    return dotted ? base * 1.5 : base;
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