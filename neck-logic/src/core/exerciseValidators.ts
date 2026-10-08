import { LessonStep, FretPosition, StaffNoteEntry, TabNoteEntry, ExerciseType } from '../types/Lesson';
import { getFretboardPositionsForNotes, getNoteFromStringAndFret, getChordNotes, getMidiNote } from './MusicEngine';

export type AnswerInput =
  | { kind: 'FRETS'; frets: FretPosition[] }
  | { kind: 'CHOICE'; value: string };

export interface CorrectReveal {
  correctSelected: FretPosition[];
  incorrectSelected: FretPosition[];
  missedPositions: FretPosition[];
}

const EMPTY_REVEAL: CorrectReveal = { correctSelected: [], incorrectSelected: [], missedPositions: [] };

const SEQUENCE_EXERCISE_TYPES: ExerciseType[] = ['SCALE_DEGREES', 'ARPEGGIO', 'TAB_READING', 'STAFF_READING'];

export function isSequenceExerciseType(type: ExerciseType | undefined): boolean {
  return !!type && SEQUENCE_EXERCISE_TYPES.includes(type);
}

export function usesChoiceInput(type: ExerciseType | undefined): boolean {
  return type === 'MULTIPLE_CHOICE' || type === 'CIRCLE_OF_FIFTHS' || type === 'HARMONIC_FIELD';
}

function positionEquals(a: FretPosition, b: FretPosition): boolean {
  return a.string === b.string && a.fret === b.fret;
}

function positionsEqualAsSet(a: FretPosition[], b: FretPosition[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((p) => b.some((q) => positionEquals(p, q))) && b.every((p) => a.some((q) => positionEquals(p, q)));
}

function notesMatchSet(selectedNoteNames: string[], targetNoteNames: string[]): boolean {
  return selectedNoteNames.every((n) => targetNoteNames.includes(n)) && targetNoteNames.every((n) => selectedNoteNames.includes(n));
}

function matchPositionsBySet(selected: FretPosition[], targets: FretPosition[]): CorrectReveal {
  const correctSelected = selected.filter((p) => targets.some((t) => positionEquals(t, p)));
  const incorrectSelected = selected.filter((p) => !targets.some((t) => positionEquals(t, p)));
  const missedPositions = targets.filter((t) => !selected.some((p) => positionEquals(t, p)));
  return { correctSelected, incorrectSelected, missedPositions };
}

function matchPositionsInOrder(selected: FretPosition[], targets: FretPosition[]): CorrectReveal {
  const correctSelected: FretPosition[] = [];
  const incorrectSelected: FretPosition[] = [];
  const missedPositions: FretPosition[] = [];
  const len = Math.max(selected.length, targets.length);

  for (let i = 0; i < len; i++) {
    const sel = selected[i];
    const tgt = targets[i];
    if (sel && tgt && positionEquals(sel, tgt)) {
      correctSelected.push(sel);
    } else {
      if (sel) incorrectSelected.push(sel);
      if (tgt) missedPositions.push(tgt);
    }
  }

  return { correctSelected, incorrectSelected, missedPositions };
}

function matchNoteNames(selected: FretPosition[], requiredNames: string[], tuning: string[]): CorrectReveal {
  const remaining = [...requiredNames];
  const correctSelected: FretPosition[] = [];
  const incorrectSelected: FretPosition[] = [];

  selected.forEach((pos) => {
    const noteName = getNoteFromStringAndFret(pos.string, pos.fret, tuning).toUpperCase();
    const idx = remaining.indexOf(noteName);
    if (idx >= 0) {
      remaining.splice(idx, 1);
      correctSelected.push(pos);
    } else {
      incorrectSelected.push(pos);
    }
  });

  const missedPositions = remaining.flatMap((noteName) => getFretboardPositionsForNotes([noteName], tuning, 22));
  return { correctSelected, incorrectSelected, missedPositions };
}

function validateShapeMatch(step: LessonStep, selected: FretPosition[], tuning: string[]): boolean {
  if (Array.isArray(step.targetShape)) {
    return selected.length > 0 && positionsEqualAsSet(selected, step.targetShape as FretPosition[]);
  }
  if (Array.isArray(step.targetNotes)) {
    const targets = (step.targetNotes as string[]).map((n) => n.toUpperCase());
    const selectedNoteNames = selected.map((f) => getNoteFromStringAndFret(f.string, f.fret, tuning).toUpperCase());
    return selectedNoteNames.length > 0 && notesMatchSet(selectedNoteNames, targets);
  }
  if (selected.length === 1) {
    const clickedNoteName = getNoteFromStringAndFret(selected[0].string, selected[0].fret, tuning);
    return clickedNoteName.toUpperCase() === ((step.targetNote as string) ?? '').toUpperCase();
  }
  return false;
}

function validateChordBuild(step: LessonStep, selected: FretPosition[], tuning: string[]): boolean {
  const root = (step.root as string) ?? 'C';
  const quality = (step.quality as string) ?? 'major';
  const targets = getChordNotes(root, quality).map((n) => n.toUpperCase());
  if (selected.length === 0 || targets.length === 0) return false;

  const selectedNoteNames = Array.from(new Set(selected.map((f) => getNoteFromStringAndFret(f.string, f.fret, tuning).toUpperCase())));
  return notesMatchSet(selectedNoteNames, targets);
}

function validateTriadInversion(step: LessonStep, selected: FretPosition[], tuning: string[]): boolean {
  if (!validateChordBuild(step, selected, tuning)) return false;

  const root = (step.root as string) ?? 'C';
  const quality = (step.quality as string) ?? 'major';
  const targets = getChordNotes(root, quality).map((n) => n.toUpperCase());
  const inversion = (step.inversion as number) ?? 0;
  const expectedBass = targets[inversion % targets.length];

  const bassPosition = [...selected].sort((a, b) => getMidiNote(a.string, a.fret, tuning) - getMidiNote(b.string, b.fret, tuning))[0];
  const bassNote = getNoteFromStringAndFret(bassPosition.string, bassPosition.fret, tuning).toUpperCase();
  return bassNote === expectedBass;
}

function validateFindAllOccurrences(step: LessonStep, selected: FretPosition[], tuning: string[]): boolean {
  const targetNote = (step.targetNote as string) ?? '';
  const maxFret = (step.maxFret as number) ?? 22;
  const targets = getFretboardPositionsForNotes([targetNote], tuning, maxFret);
  return selected.length > 0 && positionsEqualAsSet(selected, targets);
}

export function validateDrillStep(step: LessonStep, input: AnswerInput, tuning: string[]): boolean {
  switch (step.exerciseType) {
    case 'MULTIPLE_CHOICE':
      return input.kind === 'CHOICE' && input.value === step.correctAnswer;
    case 'CIRCLE_OF_FIFTHS':
      return input.kind === 'CHOICE' && input.value === step.targetKey;
    case 'HARMONIC_FIELD':
      return input.kind === 'CHOICE' && input.value === step.targetDegree;
    case 'CHORD_BUILD':
      return input.kind === 'FRETS' && validateChordBuild(step, input.frets, tuning);
    case 'TRIAD_INVERSION':
      return input.kind === 'FRETS' && validateTriadInversion(step, input.frets, tuning);
    case 'SHAPE_MATCH':
      return input.kind === 'FRETS' && validateShapeMatch(step, input.frets, tuning);
    case 'FIND_ALL_OCCURRENCES':
      return input.kind === 'FRETS' && validateFindAllOccurrences(step, input.frets, tuning);
    default:
      return false;
  }
}

export function getDrillCorrectReveal(step: LessonStep, selected: FretPosition[], tuning: string[]): CorrectReveal {
  switch (step.exerciseType) {
    case 'CHORD_BUILD':
    case 'TRIAD_INVERSION': {
      const root = (step.root as string) ?? 'C';
      const quality = (step.quality as string) ?? 'major';
      const required = getChordNotes(root, quality).map((n) => n.toUpperCase());
      return matchNoteNames(selected, required, tuning);
    }

    case 'SHAPE_MATCH': {
      if (Array.isArray(step.targetShape)) return matchPositionsBySet(selected, step.targetShape as FretPosition[]);
      if (Array.isArray(step.targetNotes)) {
        return matchNoteNames(selected, (step.targetNotes as string[]).map((n) => n.toUpperCase()), tuning);
      }
      const targetNote = ((step.targetNote as string) ?? '').toUpperCase();
      return matchNoteNames(selected, targetNote ? [targetNote] : [], tuning);
    }

    case 'FIND_ALL_OCCURRENCES': {
      const targetNote = (step.targetNote as string) ?? '';
      const maxFret = (step.maxFret as number) ?? 22;
      return matchPositionsBySet(selected, getFretboardPositionsForNotes([targetNote], tuning, maxFret));
    }

    default:
      return EMPTY_REVEAL;
  }
}

export interface SequenceTarget {
  length: number;
  isCorrectAt(index: number, selected: FretPosition[], tuning: string[]): boolean;
  getReveal(selected: FretPosition[], tuning: string[]): CorrectReveal;
}

function fretSequenceTarget(target: FretPosition[]): SequenceTarget {
  return {
    length: target.length,
    isCorrectAt: (index, selected) => !!selected[index] && positionEquals(selected[index], target[index]),
    getReveal: (selected) => matchPositionsInOrder(selected, target),
  };
}

function staffSequenceTarget(staffNotes: StaffNoteEntry[]): SequenceTarget {
  const notes = staffNotes.filter((n) => n.note);
  const targetNames = notes.map((n) => (n.note as string).toUpperCase().replace(/\d+$/, ''));

  return {
    length: notes.length,
    isCorrectAt: (index, selected, tuning) => {
      const sel = selected[index];
      return !!sel && getNoteFromStringAndFret(sel.string, sel.fret, tuning).toUpperCase() === targetNames[index];
    },
    getReveal: (selected, tuning) => {
      const correctSelected: FretPosition[] = [];
      const incorrectSelected: FretPosition[] = [];
      const missedNoteNames: string[] = [];
      const len = Math.max(selected.length, targetNames.length);

      for (let i = 0; i < len; i++) {
        const pos = selected[i];
        const targetName = targetNames[i];
        const noteName = pos ? getNoteFromStringAndFret(pos.string, pos.fret, tuning).toUpperCase() : undefined;

        if (pos && noteName === targetName) {
          correctSelected.push(pos);
        } else {
          if (pos) incorrectSelected.push(pos);
          if (targetName) missedNoteNames.push(targetName);
        }
      }

      const missedPositions = missedNoteNames.flatMap((noteName) => getFretboardPositionsForNotes([noteName], tuning, 22));
      return { correctSelected, incorrectSelected, missedPositions };
    },
  };
}

function tabSequenceTarget(tabNotes: TabNoteEntry[]): SequenceTarget {
  const target: FretPosition[] = tabNotes
    .filter((n) => n.string !== undefined && n.fret !== undefined)
    .map((n) => ({ string: n.string as number, fret: n.fret as number }));
  return fretSequenceTarget(target);
}

export function getSequenceTarget(step: LessonStep, type: ExerciseType): SequenceTarget {
  if (type === 'STAFF_READING') return staffSequenceTarget((step.staffNotes as StaffNoteEntry[]) ?? []);
  if (type === 'TAB_READING') return tabSequenceTarget((step.tabNotes as TabNoteEntry[]) ?? []);
  return fretSequenceTarget((step.targetSequence as FretPosition[]) ?? []);
}
