export interface SaleLineItem {
  itemId: string;
  name: string;
  type: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: SaleLineItem[];
  /** Subtotal before discount; if missing, computed from items (legacy). */
  subtotal?: number;
  /** Discount amount in dollars. */
  discount?: number;
  total: number;
  createdAt: string;
}
