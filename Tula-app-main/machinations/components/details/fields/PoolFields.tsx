import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FieldComponentProps } from '../types';

export const PoolFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pool-name">Name</Label>
        <Input
          id="pool-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resource-type">Resource Type</Label>
        <Input
          id="resource-type"
          value={data.resourceType || ''}
          onChange={(e) => onChange('resourceType', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="min">Min</Label>
          <Input
            id="min"
            type="number"
            value={data.min ?? 0}
            onChange={(e) => onChange('min', parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max">Max</Label>
          <Input
            id="max"
            type="number"
            value={data.max ?? 100}
            onChange={(e) => onChange('max', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="initial-value">Initial Value</Label>
        <Input
          id="initial-value"
          type="number"
          value={data.initialValue ?? 0}
          onChange={(e) => onChange('initialValue', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};