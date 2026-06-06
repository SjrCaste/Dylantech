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
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex gap-1.5 overflow-x-auto py-2.5 scrollbar-hide scroll-smooth" style={{ scrollSnapType: 'x mandatory' }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              style={{ scrollSnapAlign: 'start' }}
              className={`flex min-w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[36px] ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/60"
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
