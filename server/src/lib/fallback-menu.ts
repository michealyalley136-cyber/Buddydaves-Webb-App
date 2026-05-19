/** Approved menu fallback when DB returns zero active items — matches MenuResponse shape */
export type MenuCategoryResponse = {
  id: string;
  name: string;
  slug: string;
  items: {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    price: number;
    priceCents: number;
    imageUrl: string | null;
  }[];
};

export function getFallbackMenu(): { categories: MenuCategoryResponse[] } {
  const sandwiches = {
    id: "fallback-sandwiches",
    name: "Sandwiches",
    slug: "sandwiches",
    items: [
      {
        id: "fallback-philly",
        categoryId: "fallback-sandwiches",
        name: "Philly Cheesesteak",
        description: "Provolone cheese with seasoned grilled peppers and onions",
        price: 7.99,
        priceCents: 799,
        imageUrl:
          "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80",
      },
      {
        id: "fallback-mushroom",
        categoryId: "fallback-sandwiches",
        name: "Double Mushroom Melt",
        description: null,
        price: 7.69,
        priceCents: 769,
        imageUrl:
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
      },
    ],
  };

  const sides = {
    id: "fallback-sides",
    name: "Sides",
    slug: "sides",
    items: [
      {
        id: "fallback-curds",
        categoryId: "fallback-sides",
        name: "Cheese Curds",
        description: null,
        price: 5.99,
        priceCents: 599,
        imageUrl:
          "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&q=80",
      },
    ],
  };

  const drinks = {
    id: "fallback-drinks",
    name: "Drinks",
    slug: "drinks",
    items: [
      {
        id: "fallback-gallon-rootbeer",
        categoryId: "fallback-drinks",
        name: "Gallon Fresh Made Rootbeer",
        description: "Fresh made rootbeer",
        price: 7.99,
        priceCents: 799,
        imageUrl:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
      },
      {
        id: "fallback-float",
        categoryId: "fallback-drinks",
        name: "Rootbeer Float",
        description: "Rootbeer made fresh daily",
        price: 4.99,
        priceCents: 499,
        imageUrl:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
      },
    ],
  };

  return { categories: [sandwiches, sides, drinks] };
}
