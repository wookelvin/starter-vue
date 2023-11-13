import { MultitrackSong } from "@/models/MultitrackSong";
import { defineStore } from "pinia";
import { Howl } from "howler";

export const useHowlerStore = defineStore("howler", () => {
  let howl: Howl | null = null;
  let song = ref<MultitrackSong | null>(null);
  const state = ref({
    loaded: false,
    playing: false,
    error: "",
  });

  function init(inSong: MultitrackSong) {
    song.value = inSong;

    const options = {
      src: inSong.tracks.map((t) => inSong.rootPath + "/" + t.filename),
      html5: true,
    };
    console.log("options", options);
    howl = new Howl(options);

    howl.on("load", onLoad);
    howl.on("play", onPlay);
    howl.on("stop", onStop);
    howl.on("pause", onPause);
    howl.on("playerror", onError);
    howl.on("loaderror", onError);
    console.log("loading ...");
  }

  function onError(id: number, err: unknown) {
    console.log("howler-onerror", id, err);
  }

  function onLoad(id: number) {
    state.value.loaded = true;
    console.log("howler-load", id);
  }

  function onPlay(id: number) {
    state.value.playing = true;
    console.log("howler-play", id);
  }

  function onStop(id: number) {
    state.value.playing = false;
    console.log("howler-stop", id);
  }

  function onPause(id: number) {
    state.value.playing = false;
    console.log("howler-pause", id);
  }

  function play() {
    howl?.play();
  }

  function pause() {
    howl?.pause();
  }
  return { init, play, pause };
});
