import { ResponsiveImage as BaseResponsiveImage } from '@responsive-image/react';

import sty from './ResponsiveImage.module.scss';

export interface ResponsiveImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  src: any;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  priority?: boolean;
}

export const ResponsiveImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  sizes = '100vw',
  aspectRatio,
  objectFit = 'cover',
  priority,
  ...props
}: ResponsiveImageProps) => {
  const combinedClassName = [
    sty.responsiveImage,
    className,
    aspectRatio && sty[`aspect${aspectRatio.replace(':', '')}`],
    objectFit && sty[`fit${objectFit}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseResponsiveImage
      src={src}
      alt={alt}
      className={combinedClassName}
      loading={priority ? 'eager' : loading}
      sizes={sizes}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      {...props}
    />
  );
};
