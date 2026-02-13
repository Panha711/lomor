export interface ClothingItem {
    id: string;
    name: string;
    type: string;
    size: string;
    color: string;
    price: number;
    /** Original/old price before discount (optional). */
    price_old?: number;
    quantity: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface ClothingFormData {
    name: string;
    type: string;
    size: string;
    color: string;
    price: number;
    price_old?: number;
    quantity: number;
    image_url?: string | null;
}

export const CLOTHING_TYPES = [
    "Shirt",
    "T-Shirt",
    "Pants",
    "Jeans",
    "Jacket",
    "Hoodie",
    "Sweater",
    "Dress",
    "Skirt",
    "Shorts",
    "Coat",
    "Blazer",
    "Other",
] as const;

export const CLOTHING_SIZES = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
    "Free Size",
] as const;

export const CLOTHING_COLORS = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Navy",
    "Green",
    "Yellow",
    "Orange",
    "Purple",
    "Pink",
    "Brown",
    "Grey",
    "Beige",
    "Cream",
    "Maroon",
    "Teal",
    "Multicolor",
    "Other",
] as const;
