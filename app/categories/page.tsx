'use client';

import { CategoryManager } from '@/components/categories/category-manager';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Organize your transactions with custom categories</p>
      </div>

      <CategoryManager />
    </div>
  );
}
