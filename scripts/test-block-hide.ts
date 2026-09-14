import prisma from '../src/lib/prisma';
import { getPageWithBlocks, updatePageBlock } from '../src/lib/db/pages';

async function main() {
  console.log('=== VERIFYING BLOCK HIDING / ACTIVATING ===');

  const page = await getPageWithBlocks('home');
  if (!page) throw new Error('Page home not found');

  const colBlock = page.blocks.find((b) => b.blockType === 'collections_grid');
  if (!colBlock) throw new Error('collections_grid block not found');

  console.log(`Initial status of collections_grid: isActive = ${colBlock.isActive}`);

  // 1. Hide block
  console.log('Hiding block in DB...');
  await updatePageBlock(colBlock.id, { isActive: false });

  const pageAfterHide = await getPageWithBlocks('home');
  const colBlockAfterHide = pageAfterHide?.blocks.find((b) => b.blockType === 'collections_grid');
  console.log(`Status after hiding: isActive = ${colBlockAfterHide?.isActive}`);

  if (colBlockAfterHide?.isActive !== false) {
    console.error('FAILED: Block was not marked inactive in DB!');
  } else {
    console.log('[PASS] Block is properly marked inactive in DB and returned as isActive: false');
  }

  // 2. Restore block to active
  console.log('Restoring block to active...');
  await updatePageBlock(colBlock.id, { isActive: true });

  const pageAfterRestore = await getPageWithBlocks('home');
  const colBlockAfterRestore = pageAfterRestore?.blocks.find((b) => b.blockType === 'collections_grid');
  console.log(`Status after restoring: isActive = ${colBlockAfterRestore?.isActive}`);

  if (colBlockAfterRestore?.isActive !== true) {
    console.error('FAILED: Block was not restored to active!');
  } else {
    console.log('[PASS] Block is properly active again');
  }

  console.log('=== ALL BLOCK TOGGLE TESTS PASSED! ===');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
