import { NavLink, Link } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";

export default function Navbar() {
  const { theme, toggleTheme } = useDarkMode();

  const linkBase =
    "text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400";
  const active = "font-semibold text-orange-600 dark:text-orange-400";

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          onClick={() => window.onHomeReset && window.onHomeReset()}
          className="flex items-center gap-2"
        >
          <img
            src="/logo.svg"
            alt="MealDB Logo"
            className={`h-10 w-auto object-contain transition
              ${theme === "light" ? "invert brightness-200" : ""}
            `}
          />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : ""}`
            }
          >
            Categories
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : ""}`
            }
          >
            Favorites
          </NavLink>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-xl text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>
    </header>
  );
}
