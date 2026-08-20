import { FretboardNote } from '../components/Fretboard';
import { ClefType, NoteDuration } from '../core/MusicEngine';

export interface FretboardConfig {
    tuning?: string[];
    frets?: number;
    explicitNotes?: FretboardNote[];
    highlightNotes?: string[];
}

export interface FretPosition {
    string: number;
    fret: number;
}

export type ExerciseType =
  | 'SHAPE_MATCH'
  | 'FIND_ALL_OCCURRENCES'
  | 'MULTIPLE_CHOICE'
  | 'CHORD_BUILD'
  | 'TRIAD_INVERSION'
  | 'CIRCLE_OF_FIFTHS'
  | 'HARMONIC_FIELD'
  | 'SCALE_DEGREES'
  | 'ARPEGGIO'
  | 'TAB_READING'
  | 'STAFF_READING';

interface LessonStepBase {
    title: string;
    text?: string;
    imageUrl?: string;
    question?: string;
    fretboardConfig?: FretboardConfig;
}

export interface TheoryStep extends LessonStepBase {
    type: 'THEORY';
}

interface DrillStepBase extends LessonStepBase {
    type: 'DRILL';
}

export interface ShapeMatchStep extends DrillStepBase {
    exerciseType?: 'SHAPE_MATCH';
    targetNote?: string;
    targetNotes?: string[];
    targetShape?: FretPosition[];
}

export interface FindAllOccurrencesStep extends DrillStepBase {
    exerciseType: 'FIND_ALL_OCCURRENCES';
    targetNote: string;
}

export interface MultipleChoiceStep extends DrillStepBase {
    exerciseType: 'MULTIPLE_CHOICE';
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface ChordBuildStep extends DrillStepBase {
    exerciseType: 'CHORD_BUILD';
    root: string;
    quality: string;
}

export interface TriadInversionStep extends DrillStepBase {
    exerciseType: 'TRIAD_INVERSION';
    root: string;
    quality: string;
    inversion: 0 | 1 | 2 | 3;
}

export interface CircleOfFifthsStep extends DrillStepBase {
    exerciseType: 'CIRCLE_OF_FIFTHS';
    question: string;
    targetKey: string;
}

export interface HarmonicFieldStep extends DrillStepBase {
    exerciseType: 'HARMONIC_FIELD';
    question: string;
    key: string;
    mode: 'major' | 'minor';
    targetDegree: string;
}

interface SequenceStepBase extends DrillStepBase {
    targetSequence: FretPosition[];
}

export interface ScaleDegreesStep extends SequenceStepBase {
    exerciseType: 'SCALE_DEGREES';
}

export interface ArpeggioStep extends SequenceStepBase {
    exerciseType: 'ARPEGGIO';
}

export interface TabReadingStep extends SequenceStepBase {
    exerciseType: 'TAB_READING';
}

export interface StaffNoteEntry {
    note?: string;
    duration: NoteDuration;
    dotted?: boolean;
    target?: FretPosition;
}

export interface StaffReadingStep extends DrillStepBase {
    exerciseType: 'STAFF_READING';
    clef?: ClefType;
    beatsPerMeasure?: number;
    staffNotes: StaffNoteEntry[];
}

export type DrillStep =
  | ShapeMatchStep
  | FindAllOccurrencesStep
  | MultipleChoiceStep
  | ChordBuildStep
  | TriadInversionStep
  | CircleOfFifthsStep
  | HarmonicFieldStep
  | ScaleDegreesStep
  | ArpeggioStep
  | TabReadingStep
  | StaffReadingStep;

export type LessonStep = TheoryStep | DrillStep;

export interface LessonContentDTO {
    id: number;
    title: string;
    contentJson: string;
}
