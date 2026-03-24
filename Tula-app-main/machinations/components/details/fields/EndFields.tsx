import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldComponentProps } from '../types';

export const EndFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="end-name">Name</Label>
        <Input
          id="end-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-type">End Condition Type</Label>
        <Select
          value={data.endType || 'win'}
          onValueChange={(v) => onChange('endType', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="win">Win</SelectItem>
            <SelectItem value="lose">Lose</SelectItem>
            <SelectItem value="draw">Draw</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};