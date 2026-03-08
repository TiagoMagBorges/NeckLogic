import { FretboardNote } from '../components/Fretboard';

export interface FretboardConfig {
    tuning?: string[];
    frets?: number;
    explicitNotes?: FretboardNote[];
    highlightNotes?: string[];
}

export interface LessonStep {
    type: 'THEORY' | 'DRILL';
    title: string;
    text?: string;
    imageUrl?: string;
    question?: string;
    targetNote?: string;
    targetNotes?: string[];
    targetShape?: { string: number; fret: number }[];
    fretboardConfig?: FretboardConfig;
}

export interface LessonContentDTO {
    id: number;
    title: string;
    contentJson: string;
}