import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/mock-data';
import { getMainStore } from '@/lib/db/stores';
import { ProductClientView } from '@/components/product/ProductClientView';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Кофе не найден',
    };
  }

  const categoryName = product.categoryName || product.category;

  return {
    title: `${product.title} — ${categoryName}`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: `${product.title} | ТАВ`,
      description: product.shortDescription || product.description,
      images: product.images && product.images[0] && product.images[0].trim()
        ? [
            {
              url: product.images[0],
              width: 800,
              height: 800,
              alt: product.title,
            },
          ]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts, mainStore] = await Promise.all([
    getRelatedProducts(product.id, 4),
    getMainStore(),
  ]);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brandName || 'ТАВ',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      url: `https://tav-coffee.ru/product/${product.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#0E0A08] pt-20 sm:pt-28 lg:pt-32 pb-28 sm:pb-32 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClientView
        product={product}
        relatedProducts={relatedProducts}
        store={mainStore}
      />
    </div>
  );
}
