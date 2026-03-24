import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldComponentProps } from '../types';

export const GateFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="gate-name">Name</Label>
        <Input
          id="gate-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gate-type">Routing Type</Label>
        <Select
          value={data.gateType || 'probabilistic'}
          onValueChange={(v) => onChange('gateType', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="probabilistic">Probabilistic</SelectItem>
            <SelectItem value="conditional">Conditional</SelectItem>
          </SelectContent>
        </Select>
        {data.gateType === 'conditional' && (
          <div className="space-y-2 mt-2">
            <Label htmlFor="condition">Condition</Label>
            <Textarea
              id="condition"
              value={data.condition || ''}
              onChange={(e) => onChange('condition', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};