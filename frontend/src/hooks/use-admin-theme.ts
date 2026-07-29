import { useCallback, useEffect, useState } from "react";

export type AdminTheme = "light" | "dark" | "blue";

export const ADMIN_THEME_KEY = "techvistar-admin-theme";

export function readStoredAdminTheme(): AdminTheme {
  try {
    const value = localStorage.getItem(ADMIN_THEME_KEY);
    if (value === "light" || value === "dark" || value === "blue") return value;
  } catch {
    /* ignore */
  }
  return "light";
}

export function applyAdminTheme(theme: AdminTheme) {
  const root = document.documentElement;
  root.classList.remove("admin-theme-light", "admin-theme-dark", "admin-theme-blue", "dark");
  root.classList.add(`admin-theme-${theme}`);
  if (theme === "dark") root.classList.add("dark");
  root.dataset.adminTheme = theme;
  try {
    localStorage.setItem(ADMIN_THEME_KEY, theme);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("techvistar-theme-change"));
}

export function cycleAdminTheme(current: AdminTheme): AdminTheme {
  const order: AdminTheme[] = ["light", "dark", "blue"];
  const next = order[(order.indexOf(current) + 1) % order.length] ?? "light";
  applyAdminTheme(next);
  return next;
}

export function useAdminTheme() {
  const [theme, setTheme] = useState<AdminTheme>(() =>
    typeof window !== "undefined" ? readStoredAdminTheme() : "light",
  );

  useEffect(() => {
    applyAdminTheme(theme);
  }, [theme]);

  useEffect(() => {
    const sync = () => setTheme(readStoredAdminTheme());
    window.addEventListener("storage", sync);
    window.addEventListener("techvistar-theme-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("techvistar-theme-change", sync);
    };
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => cycleAdminTheme(prev));
  }, []);

  const setAdminTheme = useCallback((next: AdminTheme) => {
    applyAdminTheme(next);
    setTheme(next);
  }, []);

  return { theme, setAdminTheme, cycleTheme };
}
