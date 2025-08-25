'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function OptimizedImage({
  src,
  alt,
  title,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 85,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=',
  onLoad,
  objectFit = 'cover'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Générer des sources WebP et AVIF pour une meilleure performance
  const imageLoader = ({ src, width, quality }: any) => {
    // Si c'est une URL externe (Shopify), la retourner directement
    if (src.startsWith('http')) {
      return `${src}${src.includes('?') ? '&' : '?'}width=${width}&quality=${quality || 75}`;
    }
    // Pour les images locales
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  // Texte alternatif SEO optimisé
  const seoAlt = alt || 'Image produit artisanat marocain - ZaharaShop';
  const seoTitle = title || alt || 'ZaharaShop - Artisanat marocain de luxe';

  // Fallback image en cas d'erreur
  const fallbackSrc = '/images/logo.png';

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ width, height }}>
        <Image
          src={fallbackSrc}
          alt="Image non disponible - ZaharaShop"
          width={100}
          height={100}
          className="opacity-50"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      <Image
        loader={imageLoader}
        src={src}
        alt={seoAlt}
        title={seoTitle}
        width={width}
        height={height}
        priority={priority}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        sizes={sizes}
        quality={quality}
        loading={priority ? 'eager' : loading}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        style={{ objectFit: objectFit as any }}
        // Attributs SEO supplémentaires
        {...{
          'data-object-fit': objectFit,
          'data-seo-type': 'product-image',
          'itemProp': 'image'
        }}
      />
      
      {/* Métadonnées pour le SEO des images */}
      <meta itemProp="image" content={src} />
      <meta itemProp="name" content={seoTitle} />
      <meta itemProp="description" content={seoAlt} />
    </div>
  );
}