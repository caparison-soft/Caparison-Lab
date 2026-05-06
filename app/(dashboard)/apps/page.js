export const dynamic = 'force-dynamic';

import { prisma } from '../../../lib/prisma';
import MarketplaceClient from './MarketplaceClient';

export default async function AppsMarketplacePage() {
  // Fetch all active apps from the database
  const apps = await prisma.app.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return <MarketplaceClient initialApps={apps} />;
}
