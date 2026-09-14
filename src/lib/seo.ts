import { StoreLocation } from '@/types';

/**
 * Generate Schema.org JSON-LD for a Store Location
 */
export function generateStoreJsonLd(store: StoreLocation) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: `ТАВ (${store.name})`,
    image: store.photoUrl,
    telephone: store.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address,
      addressLocality: store.city,
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: store.coordinates.lat,
      longitude: store.coordinates.lng,
    },
    openingHours: store.workingHours,
    url: 'https://tav-coffee.ru',
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbsJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
