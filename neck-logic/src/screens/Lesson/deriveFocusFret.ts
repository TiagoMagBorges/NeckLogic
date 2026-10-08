import { getChordNotes, getFretboardPositionsForNotes } from '../../core/MusicEngine';
import { FretPosition, LessonStep, StaffNoteEntry, TabNoteEntry, ExerciseType } from '../../types/Lesson';

interface DeriveFocusFretParams {
  currentStep: LessonStep | undefined;
  exerciseType: ExerciseType | undefined;
  markedPosition: FretPosition | undefined;
  tuning: string[];
}

export function deriveFocusFret({ currentStep, exerciseType, markedPosition, tuning }: DeriveFocusFretParams): number | undefined {
  if (!currentStep || currentStep.type !== 'DRILL' || !exerciseType) return undefined;

  if (exerciseType === 'MULTIPLE_CHOICE') {
    return markedPosition?.fret;
  }

  if (exerciseType === 'CHORD_BUILD' || exerciseType === 'TRIAD_INVERSION') {
    const root = (currentStep.root as string) ?? 'C';
    const quality = (currentStep.quality as string) ?? 'major';
    const positions = getFretboardPositionsForNotes(getChordNotes(root, quality), tuning, 22);
    return positions.length > 0 ? Math.min(...positions.map((p) => p.fret)) : undefined;
  }

  if (exerciseType === 'SHAPE_MATCH') {
    if (Array.isArray(currentStep.targetShape)) {
      const shape = currentStep.targetShape as FretPosition[];
      return shape.length > 0 ? Math.min(...shape.map((p) => p.fret)) : undefined;
    }
    const targetNotes = Array.isArray(currentStep.targetNotes)
      ? (currentStep.targetNotes as string[])
      : currentStep.targetNote
        ? [currentStep.targetNote as string]
        : [];
    if (targetNotes.length === 0) return undefined;
    const positions = getFretboardPositionsForNotes(targetNotes, tuning, 22);
    return positions.length > 0 ? Math.min(...positions.map((p) => p.fret)) : undefined;
  }

  if (exerciseType === 'FIND_ALL_OCCURRENCES') {
    const targetNote = (currentStep.targetNote as string) ?? '';
    const maxFret = (currentStep.maxFret as number) ?? 22;
    const positions = getFretboardPositionsForNotes([targetNote], tuning, maxFret);
    return positions.length > 0 ? Math.min(...positions.map((p) => p.fret)) : undefined;
  }

  if (exerciseType === 'SCALE_DEGREES' || exerciseType === 'ARPEGGIO') {
    const sequence = (currentStep.targetSequence as FretPosition[]) ?? [];
    return sequence.length > 0 ? Math.min(...sequence.map((p) => p.fret)) : undefined;
  }

  if (exerciseType === 'TAB_READING') {
    const sequence = ((currentStep.tabNotes as TabNoteEntry[]) ?? []).filter(
      (n): n is TabNoteEntry & { string: number; fret: number } => n.string !== undefined && n.fret !== undefined
    );
    return sequence.length > 0 ? Math.min(...sequence.map((n) => n.fret)) : undefined;
  }

  if (exerciseType === 'STAFF_READING') {
    const targets = ((currentStep.staffNotes as StaffNoteEntry[]) ?? [])
      .map((n) => n.target)
      .filter((t): t is FretPosition => !!t);
    return targets.length > 0 ? Math.min(...targets.map((p) => p.fret)) : undefined;
  }

  return undefined;
}