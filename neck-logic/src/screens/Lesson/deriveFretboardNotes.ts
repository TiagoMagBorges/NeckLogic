import { getNoteFromStringAndFret } from '../../core/MusicEngine';
import { NOTATION_COLORS } from '../../core/theme';
import { FretboardNote } from '../../components/Fretboard';
import { FretPosition, SequenceNoteState, TheoryIllustration, ExerciseType } from '../../types/Lesson';
import { SEQUENCE_TYPES } from '../../hooks/useLesson';
import type { CorrectReveal } from '../../core/exerciseValidators';

interface DeriveFretboardNotesParams {
  isTheory: boolean;
  illustration: TheoryIllustration | undefined;
  markedPosition: FretPosition | undefined;
  exerciseType: ExerciseType | undefined;
  checkResult: 'IDLE' | 'CORRECT' | 'INCORRECT';
  correctReveal: CorrectReveal;
  selectedFrets: FretPosition[];
  sequenceNoteStates: SequenceNoteState[];
  tuning: string[];
}

export function deriveFretboardNotes({
                                       isTheory,
                                       illustration,
                                       markedPosition,
                                       exerciseType,
                                       checkResult,
                                       correctReveal,
                                       selectedFrets,
                                       sequenceNoteStates,
                                       tuning,
                                     }: DeriveFretboardNotesParams): FretboardNote[] {
  let notes: FretboardNote[] = [];

  if (isTheory && illustration?.kind === 'fretboard') {
    notes = illustration.notes.map((p) => ({ ...p, label: getNoteFromStringAndFret(p.string, p.fret, tuning) }));
  }

  if (markedPosition) {
    notes = [...notes, { ...markedPosition }];
  }

  if (checkResult === 'INCORRECT') {
    correctReveal.missedPositions.forEach((position) => {
      notes.push({
        ...position,
        color: NOTATION_COLORS.correct,
        label: getNoteFromStringAndFret(position.string, position.fret, tuning),
        blink: true,
      });
    });
  }

  const isSequential = !!exerciseType && (exerciseType === 'STAFF_READING' || SEQUENCE_TYPES.includes(exerciseType));

  if (selectedFrets.length > 0) {
    selectedFrets.forEach((selectedFret, index) => {
      let color: string = NOTATION_COLORS.accent;
      let label: string | undefined;

      if (isSequential && checkResult === 'IDLE') {
        const state = sequenceNoteStates[index];
        if (state === 'correct' || state === 'incorrect') {
          color = state === 'correct' ? NOTATION_COLORS.correct : NOTATION_COLORS.incorrect;
          label = getNoteFromStringAndFret(selectedFret.string, selectedFret.fret, tuning);
        }
      } else if (checkResult === 'CORRECT') {
        color = NOTATION_COLORS.correct;
        label = getNoteFromStringAndFret(selectedFret.string, selectedFret.fret, tuning);
      } else if (checkResult === 'INCORRECT') {
        const isCorrectPick = correctReveal.correctSelected.some(
          (p) => p.string === selectedFret.string && p.fret === selectedFret.fret
        );
        color = isCorrectPick ? NOTATION_COLORS.correct : NOTATION_COLORS.incorrect;
        label = getNoteFromStringAndFret(selectedFret.string, selectedFret.fret, tuning);
      }

      notes.push({ ...selectedFret, color, label, fadeOut: isSequential && checkResult === 'IDLE' });
    });
  }

  return notes;
}