import { Helmet } from '@dr.pogodin/react-helmet';
import { useEffect, useState } from 'react';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEOHelmet = ({
  title = 'default title',
  description = 'default description',
  keywords = 'word-1, word-2, word-3, word-4',
  image = '/favicon/opengraph-image.png',
  url,
}: SEOHelmetProps) => {
  const [canonical, setCanonical] = useState<string | undefined>(url);

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCanonical(window.location.origin + window.location.pathname);
    }
  }, [url]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};
