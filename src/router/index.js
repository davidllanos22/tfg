import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import AvatarEdit from "@/views/AvatarEdit.vue";
import AvatarList from "@/views/AvatarList.vue";
import AvatarPlay from "@/views/AvatarPlay.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;