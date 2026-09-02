export type SimpleExerciseType =
  | 'MULTIPLE_CHOICE'
  | 'CHORD_BUILD'
  | 'TRIAD_INVERSION'
  | 'CIRCLE_OF_FIFTHS'
  | 'HARMONIC_FIELD';

export type AdvancedExerciseType =
  | 'SHAPE_MATCH'
  | 'FIND_ALL_OCCURRENCES'
  | 'SCALE_DEGREES'
  | 'ARPEGGIO'
  | 'TAB_READING'
  | 'STAFF_READING';

export type ExerciseType = SimpleExerciseType | AdvancedExerciseType;

export type StepKind = 'THEORY' | ExerciseType;

export interface FretPosition {
    string: number;
    fret: number;
}

export type ClefType = 'treble' | 'bass';

export type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

export interface StaffNoteEntry {
    note?: string;
    duration: NoteDuration;
    dotted?: boolean;
    target?: FretPosition;
}

export interface TheoryFretboardIllustration {
    kind: 'fretboard';
    notes: FretPosition[];
}

export interface TheoryCircleIllustration {
    kind: 'circleOfFifths';
    highlightedKeys: string[];
}

export interface TheoryHarmonicFieldIllustration {
    kind: 'harmonicField';
    key: string;
    mode: 'major' | 'minor';
    highlightedDegrees: string[];
}

export interface TheoryStaffIllustration {
    kind: 'staff';
    clef: ClefType;
    beatsPerMeasure: number;
    notes: StaffNoteEntry[];
}

export type TheoryIllustration =
  | TheoryFretboardIllustration
  | TheoryCircleIllustration
  | TheoryHarmonicFieldIllustration
  | TheoryStaffIllustration;

export interface LessonStep {
    type: 'THEORY' | 'DRILL';
    exerciseType?: ExerciseType;
    title: string;
    text?: string;
    imageUrl?: string;
    question?: string;
    illustration?: TheoryIllustration;
    [key: string]: unknown;
}

export interface LessonContentDTO {
    id: number;
    title: string;
    contentJson: string;
}