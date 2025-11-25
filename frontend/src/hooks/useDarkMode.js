import { useState, useEffect } from "react";

export default function useDarkMode() {
  // Always default to DARK unless user saved preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return "dark"; // FORCE default dark always
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // remove both then add selected theme
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // RESET → follow OS theme again
  const resetToSystem = () => {
    localStorage.removeItem("theme");

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  };

  return { theme, toggleTheme, resetToSystem };
}

