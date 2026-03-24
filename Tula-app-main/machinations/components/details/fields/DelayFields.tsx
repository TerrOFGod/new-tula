import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FieldComponentProps } from '../types';

export const DelayFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="delay-name">Name</Label>
        <Input
          id="delay-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="delay-steps">Delay Steps</Label>
        <Input
          id="delay-steps"
          type="number"
          min="0"
          value={data.delaySteps ?? 1}
          onChange={(e) => onChange('delaySteps', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};