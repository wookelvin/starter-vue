import { MultitrackSong, MultitrackSongTrack } from "@/models/MultitrackSong";
import { TrackInfo } from "@/models/TrackInfo";
import { defineStore } from "pinia";
import Kali from "@descript/kali";
//import * as PitchShiftNode from "soundbank-pitch-shift";
// import { createRubberBandNode } from "rubberband-web";

export const useMediaStore = defineStore("media", () => {
  const audioContext = new AudioContext();
  let song = ref<MultitrackSong | null>(null);
  let loading = ref(false);
  const tracks = ref<TrackInfo[]>([]);
  const detune = ref(0);
  const tempo = ref(0);
  const playing = ref(false);
  const mainGain = audioContext.createGain();
  mainGain.connect(audioContext.destination);
  //let rubberbandNode: any = null;

  // const pitchShift = new Kali(1);
  // mainGain.connect(pitchShift);
  // pitchShift.connect(audioContext.destination);

  //pitchShift.connect(audioContext.destination);
  // createRubberBandNode(audioContext, "/rubberband-processor.js").then(
  //  (node) => {
  //    rubberbandNode = node;
  //    mainGain.connect(rubberbandNode);
  //    rubberbandNode.connect(audioContext.destination);
  //    rubberbandNode.setHighQuality(true);
  //    console.log("ready");
  //  },
  //);
  //mainGain.connect(audioContext.destination);

  async function getAudioBuffer(src: string) {
    const blob = await (await fetch(src)).blob();
    const arrayBuffer = await blob.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  }

  async function init(inSong: MultitrackSong) {
    song.value = inSong;

    if (!song.value) {
      return;
    }
    loading.value = true;
    const promises = song.value.tracks.map((e, i) =>
      createAudio(i, song.value!.rootPath, e),
    );

    tracks.value = await Promise.all(promises);
    tempo.value = song.value.tempo;

    loading.value = false;
    console.log("ready to play");
  }

  async function createAudio(
    index: number,
    rootUrl: string,
    track: MultitrackSongTrack,
  ) {
    const src = rootUrl + "/" + track.filename;
    const buffer = await getAudioBuffer(src);

    const audio = new Audio();
    const gainNode = audioContext.createGain();

    const pannerNode = audioContext.createStereoPanner();

    const analyzer = createLoudnessAnalyzerNode();

    gainNode.connect(pannerNode);
    gainNode.connect(analyzer);
    pannerNode.connect(mainGain);

    const trackInfo: TrackInfo = {
      buffer: buffer,
      nodes: {
        source: null,
        gain: gainNode,
        panner: pannerNode,
        analyzer: analyzer,
      },
      playing: false,
      stereoPan: 0,
      muted: false,
      solo: false,
      volume: 0.5,
      canPlay: false,
      track: track,
    };
    gainNode.gain.value = trackInfo.volume;
    pannerNode.pan.value = trackInfo.stereoPan;

    audio.addEventListener("canplaythrough", (e) => {
      trackInfo.canPlay = true;
    });
    return trackInfo;
  }

  function createLoudnessAnalyzerNode() {
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    return analyzer;
  }

  function play() {
    tracks.value.forEach((t, i) => {
      const source = audioContext.createBufferSource();
      source.buffer = t.buffer;
      if (detune.value !== 0) {
        const cents = detune.value * 100;
        source.detune.value = cents;
      }

      if (song.value && tempo.value !== song.value.tempo) {
        source.playbackRate.value = tempo.value / song.value.tempo;
      }

      source.connect(t.nodes.gain);

      source.onended = () => {
        tracks.value[i].playing = false;
        playing.value = tracks.value
          .map((t) => t.playing)
          .reduce((a, b) => a || b);
      };

      t.nodes.source = source;
      t.nodes.source.start();
      t.playing = true;
    });
    playing.value = true;
  }

  function pause() {
    tracks.value.forEach((t) => {
      t.nodes.source?.stop();
      t.nodes.source?.disconnect();
      t.nodes.source = null;
      t.playing = false;
    });
    playing.value = false;
  }

  function updateGain(index?: number) {
    const soloEnabled = !!tracks.value.filter((t) => t.solo).length;

    if (index === undefined) {
      tracks.value.forEach((t) => {
        if (t.muted || (soloEnabled && !t.solo)) {
          t.nodes.gain.gain.value = 0;
        } else {
          t.nodes.gain.gain.value = t.volume;
        }
      });
    } else {
      const t = tracks.value[index];
      if (t.muted || (soloEnabled && !t.solo)) {
        t.nodes.gain.gain.value = 0;
      } else {
        t.nodes.gain.gain.value = t.volume;
      }
    }
  }

  function updatePan(index?: number) {
    if (index) {
      const t = tracks.value[index];
      t.nodes.panner.pan.value = t.stereoPan;
    } else {
      tracks.value.forEach((t) => (t.nodes.panner.pan.value = t.stereoPan));
    }
  }

  function muteAll() {
    tracks.value.forEach((t) => (t.muted = true));
    updateGain();
  }

  function unMuteAll() {
    tracks.value.forEach((t) => (t.muted = false));
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

  function updatePitchShift() {
    // const tempoInSemiTones = -Math.log2(tempo.value / song.value!.tempo) * 12;
    // const semitones = detune.value + tempoInSemiTones;
    // pitchShift.transpose = semitones;
    (rubberbandNode as any).setPitch(detune.value);
  }

  function updatePlaybackRate() {
    //tracks.value.forEach((t, i) => {
    //  t.nodes.source!.playbackRate.value = tempo.value / song.value!.tempo;
    //});
    // updatePitchShift();
    (rubberbandNode as any).setTempo(tempo.value / song.value!.tempo);
  }

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
