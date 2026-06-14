import { useState, ImgHTMLAttributes } from "react";


interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  // If true, forces loading="eager" instead of lazy
  priority?: boolean;
}

/**
 * A drop-in replacement for standard <img> tags.
 * Provides aggressive lazy loading by default (unless priority=true)
 * and a smooth fade-in / unblur effect when the image actually loads.
 */
export function LazyImage({ className, priority, loading, decoding, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // If priority is true, don't use lazy loading.
  const loadMode = priority ? "eager" : loading || "lazy";
  
  // By default we want async decoding for smoother rendering, 
  // but let props override.
  const decodeMode = decoding || "async";

  return (
    <img
      loading={loadMode}
      decoding={decodeMode}
      onLoad={(e) => {
        setIsLoaded(true);
        if (props.onLoad) props.onLoad(e);
      }}
      className={[
        "transition-all duration-700 ease-out",
        isLoaded ? "opacity-100 blur-none" : "opacity-0 blur-sm scale-[1.02]",
        className
      ].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
