export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string;
  location: string;

  totalStock: number;
  reservedStock: number;
  availableStock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;

  warehouses: WarehouseStock[];
}