'use client';

import { categoriesApi } from '@/lib/api';
import { Category, TransactionType } from '@/lib/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui';
import { AlertDialog, EditDialog } from '@repo/ui/dialogs';
import { FormField, SelectField } from '@repo/ui/forms';
import { FolderOpen, Loader2, Pencil, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const COLORS = [
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#84CC16',
  '#22C55E',
  '#10B981',
  '#14B8A6',
  '#06B6D4',
  '#0EA5E9',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#A855F7',
  '#D946EF',
  '#EC4899',
  '#F43F5E',
  '#64748B',
  '#78716C',
];

interface CategoryManagerProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function CategoryManager({
  isDialogOpen,
  setIsDialogOpen,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDefaults, setLoadingDefaults] = useState(false);

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [icon, setIcon] = useState('MoreHorizontal');
  const [color, setColor] = useState('#3B82F6');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const incomeCategories = (categories || []).filter(
    (c) => c.type === 'income'
  );
  const expenseCategories = (categories || []).filter(
    (c) => c.type === 'expense'
  );

  const resetForm = () => {
    setName('');
    setType('expense');
    setIcon('MoreHorizontal');
    setColor('#3B82F6');
    setEditCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setEditCategory(category);
    setName(category.name);
    setType(category.type);
    setIcon(category.icon);
    setColor(category.color);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setSubmitting(true);
    try {
      if (editCategory) {
        const updated = await categoriesApi.update(editCategory.id, {
          name,
          type,
          icon,
          color,
        });
        setCategories(
          categories.map((c) => (c.id === editCategory.id ? updated : c))
        );
        toast.success('Category updated');
      } else {
        const newCategory = await categoriesApi.create({
          name,
          type,
          icon,
          color,
        });
        setCategories([...categories, newCategory]);
        toast.success('Category added');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await categoriesApi.delete(deleteId);
        setCategories(categories.filter((c) => c.id !== deleteId));
        toast.success('Category deleted');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete category'
        );
      }
      setDeleteId(null);
    }
  };

  const handleLoadDefaults = async () => {
    setLoadingDefaults(true);
    try {
      const result = await categoriesApi.loadDefaults();
      if (result.success) {
        toast.success(`Loaded ${result.count} default categories`);
        await fetchCategories();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error loading defaults:', error);
      toast.error('Failed to load default categories');
    } finally {
      setLoadingDefaults(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Empty state when no categories exist
  if (categories.length === 0) {
    return (
      <>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FolderOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Categories help you organize your transactions. Get started by
              loading default categories or create your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleLoadDefaults}
                disabled={loadingDefaults}
              >
                {loadingDefaults ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Load Default Categories
              </Button>
              <Button onClick={() => setIsDialogOpen(true)}>
                Create Custom Category
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category Dialog */}
        <EditDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
          title="Add Category"
          onSubmit={handleSubmit}
          submitText="Add"
          isLoading={submitting}
        >
          <FormField
            id="name"
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Category name"
            required
          />
          <SelectField
            id="type"
            label="Type"
            value={type}
            onChange={(v) => setType(v as TransactionType)}
            options={[
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' },
            ]}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-8 w-8 rounded-full transition-transform ${
                    color === c
                      ? 'ring-2 ring-offset-2 ring-primary scale-110'
                      : ''
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </EditDialog>
      </>
    );
  }

  const CategoryGrid = ({ items }: { items: Category[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((category) => (
        <Card key={category.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: category.color + '20' }}
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <div>
                <p className="font-medium">{category.name}</p>
                <Badge variant="outline" className="text-xs">
                  {category.type}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditDialog(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(category.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <Tabs defaultValue="expense">
        <TabsList className="mb-4">
          <TabsTrigger value="expense">
            Expense ({expenseCategories.length})
          </TabsTrigger>
          <TabsTrigger value="income">
            Income ({incomeCategories.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <CategoryGrid items={expenseCategories} />
        </TabsContent>
        <TabsContent value="income">
          <CategoryGrid items={incomeCategories} />
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <EditDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        title={editCategory ? 'Edit Category' : 'Add Category'}
        onSubmit={handleSubmit}
        submitText={editCategory ? 'Update' : 'Add'}
        isLoading={submitting}
      >
        <FormField
          id="name"
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Category name"
          required
        />
        <SelectField
          id="type"
          label="Type"
          value={type}
          onChange={(v) => setType(v as TransactionType)}
          options={[
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
          ]}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`h-8 w-8 rounded-full transition-transform ${
                  color === c
                    ? 'ring-2 ring-offset-2 ring-primary scale-110'
                    : ''
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
      </EditDialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? Transactions using this category will not be affected."
        variant="delete"
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}
