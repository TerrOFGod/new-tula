import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FieldComponentProps } from '../types';

export const ConsumerFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="consumer-name">Name</Label>
        <Input
          id="consumer-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="consumption-amount">Consumption Amount</Label>
        <Input
          id="consumption-amount"
          type="number"
          value={data.consumptionAmount ?? 1}
          onChange={(e) => onChange('consumptionAmount', parseInt(e.target.value))}
        />
        <p className="text-xs text-gray-500">Amount consumed per activation. If not specified, uses edge value.</p>
      </div>
    </div>
  );
};