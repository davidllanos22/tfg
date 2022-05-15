import { createWebHistory, createRouter } from "vue-router";
import AvatarEdit from "@/views/AvatarEdit.vue";
import AvatarList from "@/views/AvatarList.vue";
import AvatarPlay from "@/views/AvatarPlay.vue";

const routes = [
  {
    path: "/edit",
    name: "Edit Avatar",
    component: AvatarEdit,
  },
  {
    path: "/list",
    name: "Avatars",
    component: AvatarList,
  },
  {
    path: "/play",
    name: "Avatar",
    component: AvatarPlay,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/list"
  },
];

const router = createRouter({
  history: createWebHistory(),
  base: process.env.BASE_URL,
  routes,
});

export default router;