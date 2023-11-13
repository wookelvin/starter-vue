import { MultitrackSongTrack } from "./MultitrackSong";
import * as Tone from "tone";

export interface ToneTrackInfo {
  buffer: AudioBuffer;
  nodes: {
    player: Tone.Player | null;
    gain: Tone.Gain | null;
    panner: Tone.Panner | null;
  };
  muted: boolean;
  volume: number;
  solo: boolean;
  stereoPan: number;
  track: MultitrackSongTrack;
}
