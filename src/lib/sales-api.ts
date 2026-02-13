import type { ClothingItem } from "@/types/clothes";
import type { Sale, SaleLineItem } from "@/types/sale";
import { getClothes, getClothingById, updateClothing } from "./clothes-api";

const SALES_KEY = "lomor_sales";

function readSales(): Sale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SALES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSales(sales: Sale[]) {
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}

function generateId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
}

export interface SellItemInput {
  itemId: string;
  quantity: number;
}

export interface CreateSaleOptions {
  discount?: number;
}

export async function createSale(
  inputs: SellItemInput[],
  options: CreateSaleOptions = {},
): Promise<Sale | null> {
  const items: SaleLineItem[] = [];
  const now = new Date().toISOString();
  const discount = Math.max(0, options.discount ?? 0);

  for (const { itemId, quantity } of inputs) {
    if (quantity <= 0) continue;
    const item = await getClothingById(itemId);
    if (!item || item.quantity < quantity) return null;
    const subtotal = item.price * quantity;
    items.push({
      itemId: item.id,
      name: item.name,
      type: item.type,
      size: item.size,
      color: item.color,
      price: item.price,
      quantity,
      subtotal,
    });
    await updateClothing(itemId, { quantity: item.quantity - quantity });
  }

  if (items.length === 0) return null;

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const total = Math.max(0, subtotal - discount);
  const sale: Sale = {
    id: generateId(),
    items,
    subtotal,
    discount,
    total,
    createdAt: now,
  };

  const sales = readSales();
  sales.unshift(sale);
  writeSales(sales);
  return sale;
}

export function getSales(): Sale[] {
  return readSales();
}
