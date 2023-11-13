import { MultitrackSongTrack } from "./MultitrackSong";

export interface TrackInfo {
  buffer: AudioBuffer;
  nodes: {
    source: AudioBufferSourceNode | null;
    gain: GainNode;
    panner: StereoPannerNode;
    analyzer: AnalyserNode;
  };
  canPlay: boolean;
  muted: boolean;
  volume: number;
  solo: boolean;
  stereoPan: number;
  track: MultitrackSongTrack;
  playing: boolean;
}
