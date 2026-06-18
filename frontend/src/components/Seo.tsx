import Head from 'next/head';

interface SeoProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
}

export default function Seo({ title, description = '', url = '', image = '' }: SeoProps) {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Fresh Corner" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={title} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {url && <meta name="twitter:url" content={url} />}
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
} 