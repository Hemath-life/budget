'use client';

import { useState } from 'react';
import { CategoryManager } from '@/apps/components/categories/category-manager';
import { Button } from '@/apps/components/ui/button';
import { Plus } from 'lucide-react';

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your transactions with custom categories</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <CategoryManager isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
}
