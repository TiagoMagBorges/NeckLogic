import { FretboardNote } from '../components/Fretboard';

export const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const INTERVAL_LABELS = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];

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
};

export const TUNINGS: Record<string, string[]> = {
    STANDARD: ['E', 'A', 'D', 'G', 'B', 'E'],
    DROP_D: ['D', 'A', 'D', 'G', 'B', 'E'],
    HALF_STEP_DOWN: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'],
    OPEN_G: ['D', 'G', 'D', 'G', 'B', 'D']
};

export function getNoteAtFret(openNote: string, fret: number): string {
    const openIndex = CHROMATIC_SCALE.indexOf(openNote.toUpperCase());
    if (openIndex === -1) return '';

    const noteIndex = (openIndex + fret) % 12;
    return CHROMATIC_SCALE[noteIndex];
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
    const targets = targetNotes.map(n => n.toUpperCase());

    tuning.forEach((openNote, stringIndex) => {
        const stringNum = 6 - stringIndex;

        for (let fret = 0; fret <= maxFrets; fret++) {
            const currentNote = getNoteAtFret(openNote, fret);

            if (targets.includes(currentNote)) {
                const isRoot = rootNote && currentNote === rootNote.toUpperCase();
                positions.push({
                    string: stringNum,
                    fret,
                    label: currentNote,
                    color: isRoot ? rootColor : defaultColor
                });
            }
        }
    });

    return positions;
}