// frontend/src/hooks/useInfiniteScroll.js
import { useEffect, useState } from "react";

export default function useInfiniteScroll(totalItems, step = 8) {
  const [visibleCount, setVisibleCount] = useState(step);

  // reset when list size changes
  useEffect(() => {
    setVisibleCount(step);
  }, [totalItems, step]);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;

      if (nearBottom) {
        setVisibleCount((prev) =>
          Math.min(prev + step, totalItems)
        );
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalItems, step]);

  return visibleCount;
}
