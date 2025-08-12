import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useApi } from '../hooks/useApi';
import { categoriesApi } from '../services/api';
import type { Category } from '../types';

interface CategoryFormData {
  name: string;
  color: string;
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', color: '#3B82F6' });

  const categoriesQuery = useApi<Category[]>();
  const categoryMutation = useApi<Category>();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesQuery.execute(() => categoriesApi.getCategories());
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await categoryMutation.execute(() => 
        categoriesApi.createCategory(formData)
      );
      if (response.data.success) {
        setCategories(prev => [...prev, response.data.data]);
        setIsCategoryFormOpen(false);
        setFormData({ name: '', color: '#3B82F6' });
        toast.success('Category created successfully');
      }
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, color: category.color });
    setIsCategoryFormOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      const response = await categoryMutation.execute(() => 
        categoriesApi.updateCategory(selectedCategory.id, formData)
      );
      if (response.data.success) {
        setCategories(prev => prev.map(category => 
          category.id === selectedCategory.id ? response.data.data : category
        ));
        setSelectedCategory(null);
        setIsCategoryFormOpen(false);
        setFormData({ name: '', color: '#3B82F6' });
        toast.success('Category updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm('Are you sure you want to delete this category? This will remove the category from all associated tasks.')) return;

    try {
      await categoriesApi.deleteCategory(category.id);
      setCategories(prev => prev.filter(c => c.id !== category.id));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      handleUpdateCategory();
    } else {
      handleCreateCategory();
    }
  };

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Categories
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize your tasks with custom categories
            </p>
          </div>
          <Button onClick={() => {
            setSelectedCategory(null);
            setFormData({ name: '', color: '#3B82F6' });
            setIsCategoryFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Tag className="h-4 w-4 mr-1" />
                {category.taskCount} task{category.taskCount !== 1 ? 's' : ''}
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No categories found</p>
            </div>
          )}
        </div>

        {/* Category Form Modal */}
        <Modal
          isOpen={isCategoryFormOpen}
          onClose={() => {
            setIsCategoryFormOpen(false);
            setSelectedCategory(null);
            setFormData({ name: '', color: '#3B82F6' });
          }}
          title={selectedCategory ? 'Edit Category' : 'Create New Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Category Name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Category Color
              </label>
              <div className="grid grid-cols-5 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color
                        ? 'border-gray-400 scale-110'
                        : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCategoryFormOpen(false);
                  setSelectedCategory(null);
                  setFormData({ name: '', color: '#3B82F6' });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={categoryMutation.loading}>
                {selectedCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}