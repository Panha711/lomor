import type { ClothingItem, ClothingFormData } from "@/types/clothes";
import { supabase } from "./supabase";

const STORAGE_KEY = "lomor_clothes";

/* ------------------------------------------------------------------ */
/*  LocalStorage helpers (fallback when Supabase not configured)       */
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

function rowToItem(row: Record<string, unknown>): ClothingItem {
    return {
        id: String(row.id),
        name: String(row.name),
        type: String(row.type),
        size: String(row.size),
        color: String(row.color),
        price: Number(row.price),
        price_old: row.price_old != null ? Number(row.price_old) : undefined,
        quantity: Number(row.quantity),
        image_url: row.image_url != null ? String(row.image_url) : null,
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
    };
}

/* ------------------------------------------------------------------ */
/*  CRUD                                                               */
/* ------------------------------------------------------------------ */

export async function getClothes(): Promise<ClothingItem[]> {
    if (supabase) {
        const { data, error } = await supabase.from("clothes").select("*").order("created_at", { ascending: false });
        if (error) return [];
        return (data ?? []).map(rowToItem);
    }
    return readStore();
}

export async function getClothingById(id: string): Promise<ClothingItem | null> {
    if (supabase) {
        const { data, error } = await supabase.from("clothes").select("*").eq("id", id).single();
        if (error || !data) return null;
        return rowToItem(data);
    }
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
    if (supabase) {
        const { error } = await supabase.from("clothes").insert({
            id: newItem.id,
            name: newItem.name,
            type: newItem.type,
            size: newItem.size,
            color: newItem.color,
            price: newItem.price,
            price_old: newItem.price_old ?? null,
            quantity: newItem.quantity,
            image_url: newItem.image_url,
            created_at: newItem.created_at,
            updated_at: newItem.updated_at,
        });
        if (error) throw new Error(error.message);
        return newItem;
    }
    const items = readStore();
    items.unshift(newItem);
    writeStore(items);
    return newItem;
}

export async function updateClothing(id: string, updates: Partial<ClothingFormData>): Promise<ClothingItem> {
    if (supabase) {
        const current = await getClothingById(id);
        if (!current) throw new Error("Item not found");
        const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
        const { error } = await supabase
            .from("clothes")
            .update({
                name: updated.name,
                type: updated.type,
                size: updated.size,
                color: updated.color,
                price: updated.price,
                price_old: updated.price_old ?? null,
                quantity: updated.quantity,
                image_url: updated.image_url,
                updated_at: updated.updated_at,
            })
            .eq("id", id);
        if (error) throw new Error(error.message);
        return updated;
    }
    const items = readStore();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Item not found");
    items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    writeStore(items);
    return items[idx];
}

export async function deleteClothing(id: string): Promise<void> {
    if (supabase) {
        const { error } = await supabase.from("clothes").delete().eq("id", id);
        if (error) throw new Error(error.message);
        return;
    }
    const items = readStore().filter((i) => i.id !== id);
    writeStore(items);
}

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */

export async function searchClothes(query: string): Promise<ClothingItem[]> {
    const items = await getClothes();
    const q = query.toLowerCase();
    return items.filter(
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
