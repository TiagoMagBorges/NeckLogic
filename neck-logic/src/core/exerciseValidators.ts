import {
  LessonStep,
  DrillStep,
  ShapeMatchStep,
  FindAllOccurrencesStep,
  MultipleChoiceStep,
  ChordBuildStep,
  TriadInversionStep,
  CircleOfFifthsStep,
  HarmonicFieldStep,
  ScaleDegreesStep,
  ArpeggioStep,
  TabReadingStep,
  StaffReadingStep,
  FretPosition,
} from '../types/Lesson';
import { getFretboardPositionsForNotes, getNoteFromStringAndFret, getChordNotes, getMidiNote } from './MusicEngine';

export type AnswerInput =
  | { kind: 'FRETS'; frets: FretPosition[] }
  | { kind: 'CHOICE'; value: string };

export function isDrillStep(step: LessonStep): step is DrillStep {
  return step.type === 'DRILL';
}

export function getExerciseType(step: DrillStep) {
  return step.exerciseType ?? 'SHAPE_MATCH';
}

export function isShapeMatchStep(step: DrillStep): step is ShapeMatchStep {
  return getExerciseType(step) === 'SHAPE_MATCH';
}

export function isFindAllOccurrencesStep(step: DrillStep): step is FindAllOccurrencesStep {
  return getExerciseType(step) === 'FIND_ALL_OCCURRENCES';
}

export function isMultipleChoiceStep(step: LessonStep): step is MultipleChoiceStep {
  return isDrillStep(step) && getExerciseType(step) === 'MULTIPLE_CHOICE';
}

export function isChordBuildStep(step: DrillStep): step is ChordBuildStep {
  return getExerciseType(step) === 'CHORD_BUILD';
}

export function isTriadInversionStep(step: DrillStep): step is TriadInversionStep {
  return getExerciseType(step) === 'TRIAD_INVERSION';
}

export function isCircleOfFifthsStep(step: LessonStep): step is CircleOfFifthsStep {
  return isDrillStep(step) && getExerciseType(step) === 'CIRCLE_OF_FIFTHS';
}

export function isHarmonicFieldStep(step: LessonStep): step is HarmonicFieldStep {
  return isDrillStep(step) && getExerciseType(step) === 'HARMONIC_FIELD';
}

export function isScaleDegreesStep(step: LessonStep): step is ScaleDegreesStep {
  return isDrillStep(step) && getExerciseType(step) === 'SCALE_DEGREES';
}

export function isArpeggioStep(step: LessonStep): step is ArpeggioStep {
  return isDrillStep(step) && getExerciseType(step) === 'ARPEGGIO';
}

export function isTabReadingStep(step: LessonStep): step is TabReadingStep {
  return isDrillStep(step) && getExerciseType(step) === 'TAB_READING';
}

export function isStaffReadingStep(step: LessonStep): step is StaffReadingStep {
  return isDrillStep(step) && getExerciseType(step) === 'STAFF_READING';
}

export function usesChoiceInput(step: LessonStep): boolean {
  return isMultipleChoiceStep(step) || isCircleOfFifthsStep(step) || isHarmonicFieldStep(step);
}

export function validateDrillStep(step: DrillStep, input: AnswerInput, tuning: string[]): boolean {
  if (isShapeMatchStep(step)) {
    return input.kind === 'FRETS' && validateShapeMatch(step, input.frets, tuning);
  }
  if (isFindAllOccurrencesStep(step)) {
    return input.kind === 'FRETS' && validateFindAllOccurrences(step, input.frets, tuning);
  }
  if (isMultipleChoiceStep(step)) {
    return input.kind === 'CHOICE' && step.correctAnswer === input.value;
  }
  if (isChordBuildStep(step)) {
    return input.kind === 'FRETS' && validateChordBuild(step, input.frets, tuning);
  }
  if (isTriadInversionStep(step)) {
    return input.kind === 'FRETS' && validateTriadInversion(step, input.frets, tuning);
  }
  if (isCircleOfFifthsStep(step)) {
    return input.kind === 'CHOICE' && step.targetKey.toUpperCase() === input.value.toUpperCase();
  }
  if (isHarmonicFieldStep(step)) {
    return input.kind === 'CHOICE' && step.targetDegree === input.value;
  }
  if (isScaleDegreesStep(step) || isArpeggioStep(step) || isTabReadingStep(step)) {
    return input.kind === 'FRETS' && validateSequence(step.targetSequence, input.frets);
  }
  if (isStaffReadingStep(step)) {
    return input.kind === 'FRETS' && validateStaffReading(step, input.frets);
  }
  return false;
}

function validateSequence(target: FretPosition[], selected: FretPosition[]): boolean {
  if (selected.length !== target.length) return false;
  return target.every((pos, i) => selected[i].string === pos.string && selected[i].fret === pos.fret);
}

function validateStaffReading(step: StaffReadingStep, selected: FretPosition[]): boolean {
  const target = step.staffNotes
    .filter((entry): entry is typeof entry & { target: FretPosition } => !!entry.target)
    .map(entry => entry.target);

  return validateSequence(target, selected);
}

function notesMatchSet(selectedNoteNames: string[], targetNoteNames: string[]): boolean {
  const allSelectedValid = selectedNoteNames.every(n => targetNoteNames.includes(n));
  const allTargetsFound = targetNoteNames.every(t => selectedNoteNames.includes(t));
  return allSelectedValid && allTargetsFound;
}

function validateShapeMatch(step: ShapeMatchStep, selected: FretPosition[], tuning: string[]): boolean {
  if (step.targetShape && step.targetShape.length > 0) {
    if (selected.length !== step.targetShape.length) return false;
    return step.targetShape.every(target =>
      selected.some(sel => sel.string === target.string && sel.fret === target.fret)
    );
  }

  if (step.targetNotes && step.targetNotes.length > 0) {
    const selectedNoteNames = selected.map(f => getNoteFromStringAndFret(f.string, f.fret, tuning).toUpperCase());
    const targets = step.targetNotes.map(n => n.toUpperCase());
    return notesMatchSet(selectedNoteNames, targets);
  }

  if (step.targetNote) {
    if (selected.length !== 1) return false;
    const clickedNoteName = getNoteFromStringAndFret(selected[0].string, selected[0].fret, tuning);
    return clickedNoteName.toUpperCase() === step.targetNote.toUpperCase();
  }

  return false;
}

function validateChordBuild(step: ChordBuildStep, selected: FretPosition[], tuning: string[]): boolean {
  const targetNotes = getChordNotes(step.root, step.quality).map(n => n.toUpperCase());
  if (targetNotes.length === 0) return false;

  const selectedNoteNames = selected.map(f => getNoteFromStringAndFret(f.string, f.fret, tuning).toUpperCase());
  return notesMatchSet(selectedNoteNames, targetNotes);
}

function validateTriadInversion(step: TriadInversionStep, selected: FretPosition[], tuning: string[]): boolean {
  const chordNotes = getChordNotes(step.root, step.quality).map(n => n.toUpperCase());
  if (step.inversion >= chordNotes.length) return false;

  const selectedNoteNames = selected.map(f => getNoteFromStringAndFret(f.string, f.fret, tuning).toUpperCase());
  if (!notesMatchSet(selectedNoteNames, chordNotes)) return false;

  const expectedBassNote = chordNotes[step.inversion];

  const sortedByPitch = [...selected].sort(
    (a, b) => getMidiNote(a.string, a.fret, tuning) - getMidiNote(b.string, b.fret, tuning)
  );
  const bassNoteName = getNoteFromStringAndFret(sortedByPitch[0].string, sortedByPitch[0].fret, tuning).toUpperCase();

  return bassNoteName === expectedBassNote;
}

function validateFindAllOccurrences(step: FindAllOccurrencesStep, selected: FretPosition[], tuning: string[]): boolean {
  const effectiveTuning = step.fretboardConfig?.tuning ?? tuning;
  const effectiveFrets = step.fretboardConfig?.frets ?? 22;

  const correctPositions = getFretboardPositionsForNotes([step.targetNote], effectiveTuning, effectiveFrets);
  const correctSet = new Set(correctPositions.map(p => `${p.string}-${p.fret}`));
  const selectedSet = new Set(selected.map(p => `${p.string}-${p.fret}`));

  if (correctSet.size !== selectedSet.size) return false;

  for (const key of correctSet) {
    if (!selectedSet.has(key)) return false;
  }
  return true;
}
