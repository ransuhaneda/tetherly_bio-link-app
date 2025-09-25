Usage Instructions

1. Basic Local Image Usage

```typescript
import { ResponsiveImage } from '@components/ui/ResponsiveImage';
import heroImage from '@assets/images/hero.jpg?responsive';

export const HeroSection = () => {
  return (
    <>
      <ResponsiveImage
        src={heroImage}
        alt="Hero banner showcasing our product"
        priority={true} // Above-the-fold image
        aspectRatio="16:9"
        sizes="100vw"
        className="hero-image"
      />
    </>
  );
}
```

2. Gallery with Different Sizes

```typescript
import { ResponsiveImage } from '@components/ui/ResponsiveImage';
import gallery1 from '@assets/images/gallery-1.jpg?responsive';
import gallery2 from '@assets/images/gallery-2.jpg?responsive';
import gallery3 from '@assets/images/gallery-3.jpg?responsive';

const ImageGallery = () => {
  const images = [
    { src: gallery1, alt: 'Gallery image 1' },
    { src: gallery2, alt: 'Gallery image 2' },
    { src: gallery3, alt: 'Gallery image 3' },
  ];

  return (
    <div className="gallery-grid">
      {images.map((image, index) => (
        <ResponsiveImage
          key={index}
          src={image.src}
          alt={image.alt}
          aspectRatio="1:1"
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      ))}
    </div>
  );
};
```

3. Custom Query Parameters

```typescript
// High quality hero image with specific formats
import heroHQ from '@assets/images/hero.jpg?responsive&w=1920,2560&quality=95&format=webp,avif,jpg';

// Thumbnail with smaller sizes
import thumbnail from '@assets/images/thumb.jpg?responsive&w=150,300&quality=80';

const ProductCard = () => {
  return (
    <div className="product-card">
      <ResponsiveImage
        src={thumbnail}
        alt="Product thumbnail"
        aspectRatio="1:1"
        sizes="150px"
        loading="lazy"
      />
    </div>
  );
};
```

4. Using with CDN (Alternative to Local Images)

To use a CDN as a source of the images you need to install the CDN package

```bash
pnpm add @responsive-image/cdn
```

Then use with image CDNs:

```typescript
import { ResponsiveImage } from '@components/ui/ResponsiveImage';
import { cloudinary } from '@responsive-image/cdn';

const CloudinaryExample = () => {
  const cloudinaryImage = cloudinary('your-cloud-name', 'sample-image-id', {
    w: [320, 640, 1024, 1280],
    format: ['webp', 'jpg'],
    quality: 85,
  });

  return (
    <ResponsiveImage
      src={cloudinaryImage}
      alt="Image from Cloudinary"
      aspectRatio="16:9"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
};
```
