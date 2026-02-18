export type LessonType = 'THEORY' | 'DRILL' | 'RHYTHM_DRILL';

export interface LessonStep {
    type: LessonType;
    title: string;
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
    question?: string;
    targetNote?: string;
    targetString?: number;
}

export interface LessonContentDTO {
    moduleId: number;
    title: string;
    contentJson: string;
}