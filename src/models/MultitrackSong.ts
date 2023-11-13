export interface MultitrackSong {
  title: string;
  author: string;
  rootPath: string;
  preview: boolean;
  tracks: MultitrackSongTrack[];
  length: number;
  tempo: number;
}

export interface MultitrackSongTrack {
  order: number;
  name: string;
  filename: string;
}
