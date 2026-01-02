import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fill = false,
  sizes,
  quality = 85,
}: OptimizedImageProps) {
  // Handle external URLs
  const isExternal = src.startsWith("http");

  // Default sizes if not provided
  const defaultSizes = fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : undefined;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={className}
        sizes={sizes || defaultSizes}
        quality={quality}
        {...(isExternal && { unoptimized: true })}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 1200}
      height={height || 630}
      priority={priority}
      className={className}
      sizes={sizes}
      quality={quality}
      {...(isExternal && { unoptimized: true })}
    />
  );
}
