import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/pages/Home.vue')
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});