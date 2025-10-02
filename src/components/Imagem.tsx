'use client';
import Image from 'next/image';
import React from 'react';
interface Imagem {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}
const OptimizedImage: React.FC<Imagem> = ({
  src,
  alt,
  className,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  ...rest
}) => {
  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
          className="object-contain"
          {...rest}
        />
      </div>
    );
  }
  if (!width || !height) {
    console.warn(
      "OptimizedImage: 'width' and 'height' are required when 'fill' is false."
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes || `${width}px`}
      className={className}
      {...rest}
    />
  );
};
export default OptimizedImage;
