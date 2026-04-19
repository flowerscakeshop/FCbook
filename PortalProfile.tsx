import React from 'react';
import GenericList from '../../components/GenericList';
import { Product } from '../../types';

interface InventoryProps {
  data: Product[];
  onCreate: () => void;
  onDelete: (sku: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ data, onCreate, onDelete }) => {
  return (
    <GenericList 
      title="Product Inventory" 
      data={data} 
      columns={['sku', 'name', 'stock', 'price', 'cost']} 
      role="admin"
      onCreate={onCreate}
      onDelete={(id) => onDelete(String(id))}
    />
  );
};

export default Inventory;