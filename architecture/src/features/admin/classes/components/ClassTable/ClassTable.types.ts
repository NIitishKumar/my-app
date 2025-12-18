// Class table component types
export interface ClassTableProps {
  data: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

