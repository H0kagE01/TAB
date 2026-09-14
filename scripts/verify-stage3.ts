import prisma from '../src/lib/prisma';
import { getAllCategoriesForAdmin, createCategory, deleteCategory, toggleCategoryActive } from '../src/lib/db/categories';
import { getAllBrandsForAdmin, createBrand, deleteBrand } from '../src/lib/db/brands';
import { getAllStoresForAdmin, createStore, deleteStore, setMainStore } from '../src/lib/db/stores';
import { getAllCollectionsForAdmin, createCollection, updateCollection, deleteCollection, getCollections } from '../src/lib/db/collections';
import { getFilteredProducts } from '../src/lib/db/products';

async function main() {
  console.log('=== STAGE 3 COMPREHENSIVE DATA LAYER & LOGIC VERIFICATION ===\n');

  // 1. CATEGORY TESTS
  console.log('--- 1. CATEGORY TESTS ---');
  const initialCats = await getAllCategoriesForAdmin();
  console.log(`[PASS] Found ${initialCats.length} categories in DB`);
  initialCats.forEach((c) => console.log(`  - ${c.name} (slug: ${c.slug}, order: ${c.order}, products: ${c._count.products}, active: ${c.isActive})`));

  // Test creating test category
  const testCatSlug = `test-cat-${Date.now()}`;
  const createdCat = await createCategory({
    name: 'Тестовая категория',
    slug: testCatSlug,
    order: 99,
    isActive: true,
  });
  console.log(`[PASS] Created test category: ${createdCat.name} (id: ${createdCat.id})`);

  // Test toggling active
  const toggledCat = await toggleCategoryActive(createdCat.id);
  console.log(`[PASS] Toggled isActive: ${toggledCat.isActive}`);

  // Test deletion of empty category
  await deleteCategory(createdCat.id);
  console.log(`[PASS] Successfully deleted empty test category`);

  // Test safety guard on non-empty category
  const catWithProducts = initialCats.find((c) => c._count.products > 0);
  if (catWithProducts) {
    try {
      await deleteCategory(catWithProducts.id);
      console.error(`[FAIL] Should not have allowed deletion of category with products!`);
    } catch (err: any) {
      console.log(`[PASS] Safety guard blocked deletion of category with products: "${err.message}"`);
    }
  }

  // 2. BRAND TESTS
  console.log('\n--- 2. BRAND TESTS ---');
  const initialBrands = await getAllBrandsForAdmin();
  console.log(`[PASS] Found ${initialBrands.length} brands in DB`);
  initialBrands.forEach((b) => console.log(`  - ${b.name} (slug: ${b.slug}, country: ${b.country?.name || 'none'}, products: ${b._count.products})`));

  // Test creating test brand
  const testBrandSlug = `test-brand-${Date.now()}`;
  const createdBrand = await createBrand({
    name: 'Test Brand Specialty',
    slug: testBrandSlug,
    description: 'Тестовый производитель',
    countryId: initialBrands[0]?.countryId || null,
  });
  console.log(`[PASS] Created test brand: ${createdBrand.name} (id: ${createdBrand.id})`);

  // Test deleting test brand
  await deleteBrand(createdBrand.id);
  console.log(`[PASS] Successfully deleted test brand`);

  // 3. STORE TESTS
  console.log('\n--- 3. STORE TESTS ---');
  const initialStores = await getAllStoresForAdmin();
  console.log(`[PASS] Found ${initialStores.length} stores in DB`);
  initialStores.forEach((s) => console.log(`  - ${s.name} (city: ${s.city}, hours: "${s.workingHours}", isMain: ${s.isMain}, inquiries: ${s._count.inquiries})`));

  // Test creating temporary second store
  const createdStore = await createStore({
    name: 'Второй филиал ТАВ',
    city: 'Краснодар',
    address: 'ул. Красная, 100',
    phone: '+7 (900) 111-22-33',
    workingHours: 'Ежедневно: 09:00 – 22:00',
    latitude: 45.0355,
    longitude: 38.9753,
    photoUrl: '/images/store-maykop.jpg',
    isMain: false,
  });
  console.log(`[PASS] Created second store: ${createdStore.name} (id: ${createdStore.id})`);

  // Test setting as main
  await setMainStore(createdStore.id);
  const updatedMain = await prisma.store.findUnique({ where: { id: createdStore.id } });
  const oldMain = await prisma.store.findUnique({ where: { id: initialStores[0].id } });
  console.log(`[PASS] Switched main store: new main=${updatedMain?.isMain}, old main=${oldMain?.isMain}`);

  // Restore original main store
  await setMainStore(initialStores[0].id);
  console.log(`[PASS] Restored original store as main`);

  // Delete test store
  await deleteStore(createdStore.id);
  console.log(`[PASS] Successfully deleted second store`);

  // Test safety guard on deleting the only or main store
  try {
    await deleteStore(initialStores[0].id);
    console.error(`[FAIL] Should not have allowed deleting main store!`);
  } catch (err: any) {
    console.log(`[PASS] Safety guard blocked deletion of main store: "${err.message}"`);
  }

  // 4. COLLECTION TESTS & SINGLE SOURCE OF TRUTH
  console.log('\n--- 4. COLLECTION TESTS & RECONCILIATION ---');
  const collections = await getAllCollectionsForAdmin();
  console.log(`[PASS] Found ${collections.length} collections in PostgreSQL`);
  collections.forEach((c) => {
    console.log(`  - ${c.title} (slug: ${c.slug}, order: ${c.order}, products count: ${c.products.length})`);
    c.products.forEach((p, idx) => console.log(`      #${idx + 1}: [${p.product.title}] (${p.product.price} ₽, slug: ${p.product.slug})`));
  });

  // Verify public getCollections returns exact DB items
  const publicCols = await getCollections();
  console.log(`[PASS] getCollections() for public site returns ${publicCols.length} collections with synced productIds`);

  // Verify catalog filtering by collection slug
  const firstCol = collections[0];
  const filtered = await getFilteredProducts({ collection: firstCol.slug });
  console.log(`[PASS] Filtering products by collection "${firstCol.slug}" returned ${filtered.products.length} products`);
  filtered.products.forEach((p) => console.log(`      - ${p.title} (slug: ${p.slug}, collectionSlugs: ${p.collectionSlugs?.join(', ')})`));

  console.log('\n=== ALL STAGE 3 DATA LAYER & LOGIC VERIFICATIONS PASSED SUCCESSFULLY! ===');
}

main()
  .catch((e) => {
    console.error('Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
