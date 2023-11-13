import { MultitrackSong, MultitrackSongTrack } from "@/models/MultitrackSong";
import { ToneTrackInfo } from "@/models/ToneTrackInfo";
import { defineStore } from "pinia";
import * as Tone from "tone";

export const useToneStore = defineStore("tone", () => {
  const audioContext = new AudioContext();
  Tone.setContext(audioContext);
  let song = ref<MultitrackSong | null>(null);
  let loading = ref(false);
  const tracks = ref<ToneTrackInfo[]>([]);
  const detune = ref(0);
  const tempo = ref(0);

  const playing = ref(false);

  const mainGain = new Tone.Gain();
  const pitchShift = new Tone.PitchShift({
    pitch: 0,
    wet: 1,
  });
  pitchShift.windowSize = 0.03;
  mainGain.connect(pitchShift);
  pitchShift.toDestination();

  async function fetchAsBlob(src: string) {
    const blob = await (await fetch(src)).blob();
    const arrayBuffer = await blob.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  }

  async function init(inSong: MultitrackSong) {
    await Tone.start();
    song.value = inSong;

    if (!song.value) {
      return;
    }
    loading.value = true;

    const promises = song.value.tracks.map((e, i) =>
      createAudioTrack(i, song.value!.rootPath, e),
    );

    tracks.value = await Promise.all(promises);
    tempo.value = song.value.tempo;

    await Tone.loaded();

    loading.value = false;
    console.log("ready to play");
  }
  async function createAudioTrack(
    index: number,
    rootUrl: string,
    track: MultitrackSongTrack,
  ) {
    const src = rootUrl + "/" + track.filename;

    const buffer = await fetchAsBlob(src);

    // player.toDestination();

    const trackInfo: ToneTrackInfo = {
      buffer: buffer,
      nodes: {
        player: null,
        gain: null,
        panner: null,
      },
      stereoPan: 0,
      muted: false,
      solo: false,
      volume: 0.5,
      track: track,
    };

    return trackInfo;
  }

  function updatePitchShift() {
    const tempoInSemiTones = -Math.log2(tempo.value / song.value!.tempo) * 12;
    const semitones = detune.value + tempoInSemiTones;
    pitchShift.pitch = semitones;
  }

  function updatePlaybackRate() {
    tracks.value.forEach((t, i) => {
      t.nodes.player!.playbackRate = tempo.value / song.value!.tempo;
    });
    updatePitchShift();
  }

  async function play(e?: Event) {
    await Tone.start();

    if (!song.value) {
      return;
    }

    tracks.value.forEach((t, i) => {
      const player = new Tone.Player(t.buffer);
      player.playbackRate = tempo.value / song.value!.tempo;
      player.fadeIn = 0;

      const gain = new Tone.Gain();
      const panner = new Tone.Panner();

      player.connect(gain);
      gain.connect(panner);
      panner.connect(mainGain);

      gain.gain.value = t.volume;
      panner.pan.value = t.stereoPan;
      if (i === 0) {
        player.onstop = pause;
      }

      tracks.value[i].nodes.gain = gain;
      tracks.value[i].nodes.panner = panner;
      tracks.value[i].nodes.player = player;
      tracks.value[i].nodes.player!.start();
    });

    playing.value = true;

    //Tone.Transport.bpm.value = song.value.tempo;
    //Tone.Transport.start();
  }
  function pause() {
    tracks.value.forEach((t) => {
      t.nodes.player?.stop();

      t.nodes.player?.dispose();
      t.nodes.gain?.dispose();
      t.nodes.panner?.dispose();
    });
    playing.value = false;

    //Tone.Transport.pause();
  }
  function updateGain(index?: number) {
    const soloEnabled = !!tracks.value.filter((t) => t.solo).length;

    if (index === undefined) {
      tracks.value.forEach((t) => {
        if (t.muted || (soloEnabled && !t.solo)) {
          t.nodes.gain!.gain.value = 0;
        } else {
          t.nodes.gain!.gain.value = t.volume;
        }
      });
    } else {
      const t = tracks.value[index];
      if (t.muted || (soloEnabled && !t.solo)) {
        t.nodes.gain!.gain.value = 0;
      } else {
        t.nodes.gain!.gain.value = t.volume;
      }
    }
  }
  function updatePan(index?: number) {
    if (index) {
      const t = tracks.value[index];
      t.nodes.panner!.pan.value = t.stereoPan;
    } else {
      tracks.value.forEach((t) => (t.nodes.panner!.pan.value = t.stereoPan));
    }
  }
  function muteAll() {
    tracks.value.forEach((t) => (t.muted = true));
    updateGain();
  }
  function unMuteAll() {
    tracks.value.forEach((t) => (t.muted = true));
    updateGain();
  }
  function resetSettings() {
    tracks.value.forEach((t) => {
      t.muted = false;
      t.solo = false;
      t.stereoPan = 0;
      t.volume = 0.5;
    });
    updateGain();
    updatePan();
  }
  function togglePlay() {
    pause();
    play();
  }

  function updateTempo() {}

  return {
    init,
    play,
    pause,
    updateGain,
    updatePan,
    muteAll,
    unMuteAll,
    resetSettings,
    togglePlay,
    updateTempo,
    song,
    tracks,
    loading,
    detune,
    playing,
    tempo,
    updatePitchShift,
    updatePlaybackRate,
  };
});
