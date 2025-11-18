import type { Router, NavigationGuard } from "vue-router";
import { isAuthenticated } from "../services/userServices";

export const requireAuth: NavigationGuard = (to, from, next) => {
  if (isAuthenticated()) return next();
  next({ path: "/login", query: { redirect: to.fullPath } });
};

export function setupProtectedRoutes(router: Router) {
  router.beforeEach((to, from, next) => {
    if (to.meta?.requiresAuth) return requireAuth(to, from, next);
    next();
  });
}
