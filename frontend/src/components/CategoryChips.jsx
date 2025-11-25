// frontend/src/components/CategoryChips.jsx
export default function CategoryChips({ categories, activeCategory, onClick }) {
    if (!categories || categories.length === 0) return null;
  
    return (
      <div
        className="
          flex gap-3 overflow-x-auto pb-3 scrollbar-hide
          whitespace-nowrap
        "
      >
        {categories.map((c) => {
          const name = c.strCategory;
          const isActive = activeCategory === name;
  
          return (
            <button
              key={name}
              onClick={() => onClick(name)}
              className={`
                px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold
                border transition shadow-sm
                inline-flex items-center
                ${
                  isActive
                    ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200 dark:shadow-orange-900/40"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:border-orange-400"
                }
              `}
            >
              {name}
            </button>
          );
        })}
      </div>
    );
  }
  