import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';

interface EnumEditorProps {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
}

export const EnumEditor = ({ values, onChange, label = 'Enum Values' }: EnumEditorProps) => {
  const addValue = () => {
    onChange([...values, '']);
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const updateValue = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <Button variant="outline" size="sm" onClick={addValue}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Value
        </Button>
      </div>
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => updateValue(index, e.target.value)}
            placeholder={`Value ${index + 1}`}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => removeValue(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};