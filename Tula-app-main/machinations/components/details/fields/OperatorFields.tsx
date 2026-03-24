import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldComponentProps } from '../types';

export const OperatorFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="operator">Operator</Label>
        <Select
          value={data.operator || 'X'}
          onValueChange={(v) => onChange('operator', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="X">X (Next)</SelectItem>
            <SelectItem value="F">F (Future)</SelectItem>
            <SelectItem value="G">G (Globally)</SelectItem>
            <SelectItem value="U">U (Until)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};