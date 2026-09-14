import prisma from '@/lib/prisma';
import { StoreLocation } from '@/types';
import { mockStores } from '@/lib/mock-data/stores';

export interface AdminStoreItem {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  formattedPhone: string;
  workingHours: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  isMain: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    inquiries: number;
  };
}

export interface CreateStoreInput {
  name: string;
  city: string;
  address: string;
  phone: string;
  formattedPhone?: string;
  workingHours: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  isMain?: boolean;
  description?: string | null;
}

export interface UpdateStoreInput {
  name?: string;
  city?: string;
  address?: string;
  phone?: string;
  formattedPhone?: string;
  workingHours?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  isMain?: boolean;
  description?: string | null;
}

function mapPrismaStoreToAppStore(s: any): StoreLocation {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    city: s.city,
    workingHours: s.workingHours,
    phone: s.phone,
    formattedPhone: s.formattedPhone,
    coordinates: {
      lat: Number(s.latitude),
      lng: Number(s.longitude),
    },
    photoUrl: s.photoUrl,
    isMain: s.isMain,
    description: s.description || undefined,
  };
}

/**
 * Fetch all stores ordered by isMain DESC, name ASC (for Public Site)
 */
export async function getStores(): Promise<StoreLocation[]> {
  try {
    const stores = await prisma.store.findMany({
      orderBy: [{ isMain: 'desc' }, { name: 'asc' }],
    });
    if (stores.length > 0) return stores.map(mapPrismaStoreToAppStore);
  } catch (error) {
    console.warn('Stores DB unavailable, using fallback mock data');
  }
  return mockStores;
}

/**
 * Fetch the primary (isMain=true) store, fallback to first store, then mock
 */
export async function getMainStore(): Promise<StoreLocation> {
  try {
    const store =
      (await prisma.store.findFirst({ where: { isMain: true } })) ??
      (await prisma.store.findFirst());
    if (store) return mapPrismaStoreToAppStore(store);
  } catch (error) {
    console.warn('Main store DB unavailable, using fallback mock data');
  }
  return mockStores[0];
}

/**
 * Fetch all stores for Admin Panel
 */
export async function getAllStoresForAdmin(): Promise<AdminStoreItem[]> {
  try {
    const stores = await prisma.store.findMany({
      orderBy: [{ isMain: 'desc' }, { name: 'asc' }],
      include: {
        _count: { select: { inquiries: true } },
      },
    });

    return stores.map((s) => ({
      id: s.id,
      name: s.name,
      city: s.city,
      address: s.address,
      phone: s.phone,
      formattedPhone: s.formattedPhone,
      workingHours: s.workingHours,
      latitude: Number(s.latitude),
      longitude: Number(s.longitude),
      photoUrl: s.photoUrl,
      isMain: s.isMain,
      description: s.description,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      _count: s._count,
    }));
  } catch (error) {
    console.warn('DB unavailable in getAllStoresForAdmin, using mock fallback');
    return mockStores.map((s) => ({
      id: s.id,
      name: s.name,
      city: s.city,
      address: s.address,
      phone: s.phone,
      formattedPhone: s.formattedPhone,
      workingHours: s.workingHours,
      latitude: s.coordinates.lat,
      longitude: s.coordinates.lng,
      photoUrl: s.photoUrl,
      isMain: s.isMain || false,
      description: s.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { inquiries: 0 },
    }));
  }
}

/**
 * Fetch single store by ID
 */
export async function getStoreById(id: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        _count: { select: { inquiries: true } },
      },
    });
    if (!store) return null;
    return {
      ...store,
      latitude: Number(store.latitude),
      longitude: Number(store.longitude),
    };
  } catch (error) {
    console.warn('DB unavailable in getStoreById, using mock fallback');
    const s = mockStores.find((x) => x.id === id);
    if (!s) return null;
    return {
      id: s.id,
      name: s.name,
      city: s.city,
      address: s.address,
      phone: s.phone,
      formattedPhone: s.formattedPhone,
      workingHours: s.workingHours,
      latitude: s.coordinates.lat,
      longitude: s.coordinates.lng,
      photoUrl: s.photoUrl,
      isMain: s.isMain || false,
      description: s.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { inquiries: 0 },
    };
  }
}

/**
 * Format phone string to digits for tel: links
 */
function cleanPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : `+${digits}`;
}

/**
 * Create a new Store
 */
export async function createStore(data: CreateStoreInput) {
  const formattedPhone = data.formattedPhone || cleanPhone(data.phone);

  return prisma.$transaction(async (tx) => {
    // If this store is marked as main, unset isMain on all other stores
    if (data.isMain) {
      await tx.store.updateMany({
        where: { isMain: true },
        data: { isMain: false },
      });
    }

    return tx.store.create({
      data: {
        name: data.name.trim(),
        city: data.city.trim(),
        address: data.address.trim(),
        phone: data.phone.trim(),
        formattedPhone,
        workingHours: data.workingHours.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
        photoUrl: data.photoUrl.trim(),
        isMain: data.isMain ?? false,
        description: data.description?.trim() || null,
      },
    });
  });
}

/**
 * Update an existing Store
 */
export async function updateStore(id: string, data: UpdateStoreInput) {
  const formattedPhone = data.phone
    ? data.formattedPhone || cleanPhone(data.phone)
    : data.formattedPhone;

  return prisma.$transaction(async (tx) => {
    // If setting this store as main, unset all others
    if (data.isMain === true) {
      await tx.store.updateMany({
        where: { id: { not: id }, isMain: true },
        data: { isMain: false },
      });
    }

    return tx.store.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.city !== undefined && { city: data.city.trim() }),
        ...(data.address !== undefined && { address: data.address.trim() }),
        ...(data.phone !== undefined && { phone: data.phone.trim() }),
        ...(formattedPhone !== undefined && { formattedPhone }),
        ...(data.workingHours !== undefined && { workingHours: data.workingHours.trim() }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl.trim() }),
        ...(data.isMain !== undefined && { isMain: data.isMain }),
        ...(data.description !== undefined && { description: data.description?.trim() || null }),
      },
    });
  });
}

/**
 * Set a Store as the primary/main store
 */
export async function setMainStore(id: string) {
  return prisma.$transaction(async (tx) => {
    await tx.store.updateMany({
      where: { id: { not: id } },
      data: { isMain: false },
    });
    return tx.store.update({
      where: { id },
      data: { isMain: true },
    });
  });
}

/**
 * Delete a Store
 */
export async function deleteStore(id: string) {
  const count = await prisma.store.count();
  if (count <= 1) {
    throw new Error('Невозможно удалить единственный магазин в системе');
  }

  const store = await prisma.store.findUnique({
    where: { id },
  });
  if (!store) throw new Error('Магазин не найден');

  if (store.isMain) {
    throw new Error(
      'Невозможно удалить главный флагманский магазин. Сначала назначьте другой магазин главным.'
    );
  }

  return prisma.store.delete({
    where: { id },
  });
}
