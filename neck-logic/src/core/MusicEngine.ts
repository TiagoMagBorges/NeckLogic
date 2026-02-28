import { FretboardNote } from '../components/Fretboard';

export const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const TUNINGS: Record<string, string[]> = {
    STANDARD: ['E', 'B', 'G', 'D', 'A', 'E'],
    DROP_D: ['E', 'B', 'G', 'D', 'A', 'D'],
    HALF_STEP_DOWN: ['D#', 'A#', 'F#', 'C#', 'G#', 'D#'],
    OPEN_G: ['D', 'B', 'G', 'D', 'G', 'D']
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
    color: string = '#00D9FF'
): FretboardNote[] {
    const positions: FretboardNote[] = [];
    const targets = targetNotes.map(n => n.toUpperCase());

    tuning.forEach((openNote, stringIndex) => {
        const stringNum = stringIndex + 1;

        for (let fret = 0; fret <= maxFrets; fret++) {
            const currentNote = getNoteAtFret(openNote, fret);

            if (targets.includes(currentNote)) {
                positions.push({
                    string: stringNum,
                    fret,
                    label: currentNote,
                    color
                });
            }
        }
    });

    return positions;
}