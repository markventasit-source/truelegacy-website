import { useEffect, useRef, useState } from "react";

/**
 * Mounts children when the placeholder nears the viewport.
 * Defers JS parse/eval for below-fold sections (main-thread savings).
 */
const LazyWhenVisible = ({
  children,
  rootMargin = "80px",
  minHeight,
  className = "",
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      {visible ? children : null}
    </div>
  );
};

export default LazyWhenVisible;
