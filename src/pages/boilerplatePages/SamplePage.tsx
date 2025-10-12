// For reference only. if not needed remove in router then delete

// import { useEffect } from 'react';

import sty from '../LandingPage.module.scss';

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
      <section className={sty.quickStart}>
        <h2 className={sty.sectionTitle} style={{ color: '#fff3e0' }}>
          Quick Start
        </h2>
        <div className={sty.codeBlock}>
          <pre className={sty.code}>
            {`# Clone the boilerplate
git clone <url>

# Install dependencies with PNPM
pnpm install

# Start development server
pnpm run dev

# Run tests
pnpm test

# Build for production
pnpm run build`}
          </pre>
        </div>
      </section>
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
