import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/pages/Home.vue"),
  },
  {
    path: "/audio-api",
    component: () => import("@/pages/AudioApi.vue"),
  },
  {
    path: "/tonejs",
    component: () => import("@/pages/Tone.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
