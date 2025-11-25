// frontend/src/components/SkeletonCard.jsx

export default function SkeletonCard() {
    return (
      <div className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 skeleton">
        <div className="h-40 w-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }
  