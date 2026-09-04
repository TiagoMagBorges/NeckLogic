import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { getAbsoluteSemitone, getDurationBeats } from './MusicEngine';
import { StaffNoteEntry } from '../types/Lesson';

const NOTE_ASSETS: Record<string, number> = {
  E2: require('../../assets/audio/guitar-acoustic/E2.mp3'),
  F2: require('../../assets/audio/guitar-acoustic/F2.mp3'),
  'F#2': require('../../assets/audio/guitar-acoustic/Fs2.mp3'),
  G2: require('../../assets/audio/guitar-acoustic/G2.mp3'),
  A2: require('../../assets/audio/guitar-acoustic/A2.mp3'),
  'A#2': require('../../assets/audio/guitar-acoustic/As2.mp3'),
  B2: require('../../assets/audio/guitar-acoustic/B2.mp3'),
  C3: require('../../assets/audio/guitar-acoustic/C3.mp3'),
  'C#3': require('../../assets/audio/guitar-acoustic/Cs3.mp3'),
  D3: require('../../assets/audio/guitar-acoustic/D3.mp3'),
  'D#3': require('../../assets/audio/guitar-acoustic/Ds3.mp3'),
  E3: require('../../assets/audio/guitar-acoustic/E3.mp3'),
  F3: require('../../assets/audio/guitar-acoustic/F3.mp3'),
  'F#3': require('../../assets/audio/guitar-acoustic/Fs3.mp3'),
  G3: require('../../assets/audio/guitar-acoustic/G3.mp3'),
  A3: require('../../assets/audio/guitar-acoustic/A3.mp3'),
  'A#3': require('../../assets/audio/guitar-acoustic/As3.mp3'),
  B3: require('../../assets/audio/guitar-acoustic/B3.mp3'),
  C4: require('../../assets/audio/guitar-acoustic/C4.mp3'),
  'C#4': require('../../assets/audio/guitar-acoustic/Cs4.mp3'),
  D4: require('../../assets/audio/guitar-acoustic/D4.mp3'),
  'D#4': require('../../assets/audio/guitar-acoustic/Ds4.mp3'),
  E4: require('../../assets/audio/guitar-acoustic/E4.mp3'),
  F4: require('../../assets/audio/guitar-acoustic/F4.mp3'),
  'F#4': require('../../assets/audio/guitar-acoustic/Fs4.mp3'),
  G4: require('../../assets/audio/guitar-acoustic/G4.mp3'),
  A4: require('../../assets/audio/guitar-acoustic/A4.mp3'),
  'A#4': require('../../assets/audio/guitar-acoustic/As4.mp3'),
  B4: require('../../assets/audio/guitar-acoustic/B4.mp3'),
  C5: require('../../assets/audio/guitar-acoustic/C5.mp3'),
  'C#5': require('../../assets/audio/guitar-acoustic/Cs5.mp3'),
  D5: require('../../assets/audio/guitar-acoustic/D5.mp3')
};

const AVAILABLE_NOTES = Object.keys(NOTE_ASSETS);

function findClosestSample(noteWithOctave: string): string {
  if (NOTE_ASSETS[noteWithOctave]) return noteWithOctave;

  const target = getAbsoluteSemitone(noteWithOctave);
  let closest = AVAILABLE_NOTES[0];
  let closestDistance = Infinity;

  for (const candidate of AVAILABLE_NOTES) {
    const distance = Math.abs(getAbsoluteSemitone(candidate) - target);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = candidate;
    }
  }

  return closest;
}

let player: AudioPlayer | null = null;

export function playNote(noteWithOctave: string) {
  const sampleKey = findClosestSample(noteWithOctave);
  const source = NOTE_ASSETS[sampleKey];

  if (!player) {
    player = createAudioPlayer(source);
  } else {
    player.replace(source);
  }

  player.seekTo(0);
  player.play();
}

export function playSequence(sequence: StaffNoteEntry[], tempo: number = 100) {
  const msPerBeat = 60000 / tempo;
  let elapsed = 0;

  sequence.forEach((entry) => {
    const beats = getDurationBeats(entry.duration, entry.dotted);

    if (entry.note) {
      const noteAtTime = entry.note;
      setTimeout(() => playNote(noteAtTime), elapsed);
    }

    elapsed += beats * msPerBeat;
  });
}