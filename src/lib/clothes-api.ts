import type { ClothingItem, ClothingFormData } from "@/types/clothes";

const STORAGE_KEY = "lomor_clothes";

/* ------------------------------------------------------------------ */
/*  LocalStorage helpers                                               */
/* ------------------------------------------------------------------ */

function readStore(): ClothingItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ClothingItem[]) : [];
    } catch {
        return [];
    }
}

function writeStore(items: ClothingItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId(): string {
    return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
}

/* ------------------------------------------------------------------ */
/*  CRUD                                                               */
/* ------------------------------------------------------------------ */

export async function getClothes(): Promise<ClothingItem[]> {
    return readStore();
}

export async function getClothingById(id: string): Promise<ClothingItem | null> {
    return readStore().find((i) => i.id === id) ?? null;
}

export async function createClothing(item: ClothingFormData): Promise<ClothingItem> {
    const now = new Date().toISOString();
    const newItem: ClothingItem = {
        id: generateId(),
        ...item,
        image_url: item.image_url ?? null,
        created_at: now,
        updated_at: now,
    };
    const items = readStore();
    items.unshift(newItem);
    writeStore(items);
    return newItem;
}

export async function updateClothing(id: string, updates: Partial<ClothingFormData>): Promise<ClothingItem> {
    const items = readStore();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Item not found");
    items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    writeStore(items);
    return items[idx];
}

export async function deleteClothing(id: string): Promise<void> {
    const items = readStore().filter((i) => i.id !== id);
    writeStore(items);
}

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */

export async function searchClothes(query: string): Promise<ClothingItem[]> {
    const q = query.toLowerCase();
    return readStore().filter(
        (i) =>
            i.name.toLowerCase().includes(q) ||
            i.type.toLowerCase().includes(q) ||
            i.color.toLowerCase().includes(q)
    );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

export interface DashboardStats {
    totalItems: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
    totalValue: number;
    typeBreakdown: Record<string, number>;
    colorBreakdown: Record<string, number>;
}

export function computeStats(items: ClothingItem[]): DashboardStats {
    const totalItems = items.length;
    const inStock = items.filter((i) => i.quantity > 0).length;
    const outOfStock = items.filter((i) => i.quantity === 0).length;
    const lowStock = items.filter((i) => i.quantity > 0 && i.quantity <= 5).length;
    const totalValue = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const typeBreakdown: Record<string, number> = {};
    const colorBreakdown: Record<string, number> = {};

    for (const item of items) {
        typeBreakdown[item.type] = (typeBreakdown[item.type] ?? 0) + item.quantity;
        colorBreakdown[item.color] = (colorBreakdown[item.color] ?? 0) + item.quantity;
    }

    return { totalItems, inStock, outOfStock, lowStock, totalValue, typeBreakdown, colorBreakdown };
}
