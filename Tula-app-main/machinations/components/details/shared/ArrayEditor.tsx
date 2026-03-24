import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';

interface ArrayEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addButtonLabel?: string;
  showDragHandle?: boolean;
}

export const ArrayEditor = ({
  label,
  items,
  onChange,
  placeholder = '',
  addButtonLabel = 'Add',
  showDragHandle = false,
}: ArrayEditorProps) => {
  const addItem = () => {
    onChange([...items, '']);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <Button variant="outline" size="sm" onClick={addItem}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {addButtonLabel}
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {showDragHandle && <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />}
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={placeholder || `Value ${index + 1}`}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};