import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FieldComponentProps } from '../types';

export const TriggerFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="trigger-name">Name</Label>
        <Input
          id="trigger-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="trigger-event">Trigger Event</Label>
        <Input
          id="trigger-event"
          value={data.triggerEvent || ''}
          onChange={(e) => onChange('triggerEvent', e.target.value)}
        />
        <p className="text-xs text-gray-500">Name of the event that triggers this node.</p>
      </div>
    </div>
  );
};