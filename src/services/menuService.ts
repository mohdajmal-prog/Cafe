import { MenuItem, MOCK_MENU_ITEMS, MOCK_CATEGORIES, Category } from "./types";
import { MOCK_DELAY } from "../constants/api";

export const menuService = {
  // Fetch all menu items
  async getMenuItems(): Promise<MenuItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_MENU_ITEMS), MOCK_DELAY);
    });
  },

  // Fetch single item
  async getMenuItem(id: string): Promise<MenuItem | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = MOCK_MENU_ITEMS.find((item) => item.id === id);
        resolve(item || null);
      }, MOCK_DELAY / 2);
    });
  },

  // Search items
  async searchItems(query: string): Promise<MenuItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_MENU_ITEMS.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, MOCK_DELAY);
    });
  },

  // Get categories
  async getCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CATEGORIES), MOCK_DELAY / 2);
    });
  },

  // Get items by category
  async getItemsByCategory(category: string): Promise<MenuItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_MENU_ITEMS.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );
        resolve(filtered);
      }, MOCK_DELAY);
    });
  },
};
