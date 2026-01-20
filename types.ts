
export enum UnitType {
  UN = 'UN',
  KG = 'KG',
  L = 'L'
}

export enum ProductStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: UnitType;
  factorBox: number;
  factorPack: number;
  factorUnit: number;
  status: ProductStatus;
}

export interface InventoryItem {
  productId: string;
  boxes: number;
  packs: number;
  units: number;
  totalConsolidated: number;
}

export interface InventoryRecord {
  id: string;
  date: string; // YYYY-MM-DD
  responsible: string;
  items: InventoryItem[];
  createdAt: string; // ISO String
  updatedAt?: string; // ISO String
}

export type View = 'products' | 'counting' | 'history';
