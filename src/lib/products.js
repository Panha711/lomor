export const products = [
  {
    slug: "linen-overshirt",
    title: "Linen Overshirt",
    price: "¥4,200",
    category: "Tops",
    sizes: "S, M, L, XL",
    sku: "TOP-001",
    stock: 24,
    description:
      "A relaxed overshirt in breathable linen. Perfect for layering over tees or wearing alone on mild days. Regular fit with a clean finish.",
  },
  {
    slug: "wide-leg-trousers",
    title: "Wide-Leg Trousers",
    price: "¥5,800",
    category: "Bottoms",
    sizes: "XS, S, M, L, XL",
    sku: "BOT-002",
    stock: 18,
    description:
      "High-waisted wide-leg trousers in a soft cotton blend. Comfortable for all-day wear with a tailored look.",
  },
  {
    slug: "cotton-tee",
    title: "Cotton Tee",
    price: "¥2,400",
    category: "Tops",
    sizes: "S, M, L, XL",
    sku: "TOP-003",
    stock: 56,
    description:
      "Essential crewneck tee in 100% cotton. Soft, durable, and easy to layer. Available in multiple colors.",
  },
  {
    slug: "wool-blend-coat",
    title: "Wool Blend Coat",
    price: "¥18,500",
    category: "Outerwear",
    sizes: "S, M, L, XL",
    sku: "OUT-004",
    stock: 8,
    description:
      "Structured wool blend coat with a modern silhouette. Warm and versatile for the season.",
  },
  {
    slug: "denim-jacket",
    title: "Denim Jacket",
    price: "¥7,200",
    category: "Outerwear",
    sizes: "S, M, L, XL",
    sku: "OUT-005",
    stock: 14,
    description:
      "Classic denim jacket. Mid-weight, versatile for layering.",
  },
  {
    slug: "pleated-midi-skirt",
    title: "Pleated Midi Skirt",
    price: "¥4,800",
    category: "Bottoms",
    sizes: "XS, S, M, L",
    sku: "BOT-006",
    stock: 22,
    description:
      "Pleated midi skirt in a flowing fabric. High waist, easy to style.",
  },
  {
    slug: "cashmere-sweater",
    title: "Cashmere Sweater",
    price: "¥12,000",
    category: "Tops",
    sizes: "S, M, L, XL",
    sku: "TOP-007",
    stock: 12,
    description:
      "Soft cashmere crewneck sweater. Lightweight and warm.",
  },
  {
    slug: "canvas-tote",
    title: "Canvas Tote Bag",
    price: "¥3,200",
    category: "Accessories",
    sizes: "One size",
    sku: "ACC-008",
    stock: 30,
    description:
      "Spacious canvas tote with leather trim. Everyday carry.",
  },
  {
    slug: "chino-shorts",
    title: "Chino Shorts",
    price: "¥3,600",
    category: "Bottoms",
    sizes: "S, M, L, XL",
    sku: "BOT-009",
    stock: 28,
    description:
      "Relaxed chino shorts. Mid-length, multiple colors.",
  },
  {
    slug: "silk-blouse",
    title: "Silk Blouse",
    price: "¥8,400",
    category: "Tops",
    sizes: "XS, S, M, L",
    sku: "TOP-010",
    stock: 16,
    description:
      "Lightweight silk blouse. Collar detail, easy to dress up or down.",
  },
  {
    slug: "leather-belt",
    title: "Leather Belt",
    price: "¥2,800",
    category: "Accessories",
    sizes: "S, M, L",
    sku: "ACC-011",
    stock: 45,
    description:
      "Full-grain leather belt. Brass buckle, multiple widths.",
  },
  {
    slug: "knit-cardigan",
    title: "Knit Cardigan",
    price: "¥6,800",
    category: "Outerwear",
    sizes: "S, M, L, XL",
    sku: "OUT-012",
    stock: 20,
    description:
      "Button-front knit cardigan. Soft yarn, relaxed fit.",
  },
];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) ?? null;
}
