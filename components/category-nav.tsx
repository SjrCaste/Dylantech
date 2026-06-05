"use client"

interface Category {
  id: string
  label: string
}

interface CategoryNavProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryClick: (categoryId: string) => void
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  return (
    <nav className="sticky top-14 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={`flex min-w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
