import React from 'react';
import GenericList from '../../components/GenericList';
import { Expense } from '../../types';

interface ExpensesProps {
  data: Expense[];
  onCreate: () => void;
  onDelete: (id: number) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ data, onCreate, onDelete }) => {
  return (
    <GenericList 
      title="Expenses" 
      data={data} 
      columns={['date', 'category', 'vendor', 'amount', 'gst']} 
      role="admin"
      onCreate={onCreate}
      onDelete={(id) => onDelete(Number(id))}
    />
  );
};

export default Expenses;