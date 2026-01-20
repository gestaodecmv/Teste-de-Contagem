
import { Product, InventoryRecord } from '../types';

const PRODUCTS_KEY = 'inv_products';
const HISTORY_KEY = 'inv_history';

export const loadProducts = (): Product[] => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const loadHistory = (): InventoryRecord[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveHistory = (history: InventoryRecord[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};
