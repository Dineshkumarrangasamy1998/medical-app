import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { setupProtectedRoutes } from "./protected";

const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../pages/home/Home.vue") },
  { path: "/login", component: () => import("../pages/auth/Login.vue") },
  { path: "/register", component: () => import("../pages/auth/Register.vue") },
  {
    path: "/doctors",
    component: () => import("../pages/doctors/DoctorList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/patients",
    component: () => import("../pages/patients/PatientList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/appointment",
    component: () => import("../pages/appointment/Appointment.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupProtectedRoutes(router);

export default router;
