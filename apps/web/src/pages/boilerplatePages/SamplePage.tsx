// For reference only. if not needed remove in router then delete

// import { useEffect } from 'react';

import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import motorcycleImage from '@assets/images/toa-heftiba-IrpBb-5YGZw-unsplash.jpg?responsive';

export const SamplePage = () => {
  // error display test
  // throw new Error('Runtime Error Test Sample');

  // useEffect(() => {
  //   throw new Error('Error inside useEffect!');
  // }, []);

  return (
    <>
      <ResponsiveImage
        src={motorcycleImage}
        alt="Hero banner showcasing our product"
        priority={true}
        sizes="100vw"
        objectFit="cover"
        className="hero-image"
      />
    </>
  );
};
