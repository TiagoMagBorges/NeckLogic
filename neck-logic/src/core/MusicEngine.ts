export const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const TUNINGS = {
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

export function getFretsForNote(targetNote: string, openNote: string, maxFrets: number = 22): number[] {
    const targetIndex = CHROMATIC_SCALE.indexOf(targetNote.toUpperCase());
    const openIndex = CHROMATIC_SCALE.indexOf(openNote.toUpperCase());

    if (targetIndex === -1 || openIndex === -1) return [];

    let distance = targetIndex - openIndex;
    if (distance < 0) {
        distance += 12;
    }

    const frets: number[] = [];
    for (let fret = distance; fret <= maxFrets; fret += 12) {
        frets.push(fret);
    }

    return frets;
}