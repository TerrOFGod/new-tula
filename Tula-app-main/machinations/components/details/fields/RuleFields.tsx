import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldComponentProps } from '../types';

export const RuleFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="rule-name">Name</Label>
        <Input
          id="rule-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="when">When (condition)</Label>
        <Textarea
          id="when"
          value={data.when || ''}
          onChange={(e) => onChange('when', e.target.value)}
          placeholder="e.g., Attacker.Element = Fire and Target.Element = Air"
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rule-effect">Effect</Label>
        <Textarea
          id="rule-effect"
          value={data.effect || ''}
          onChange={(e) => onChange('effect', e.target.value)}
          placeholder="e.g., Attacker.Attack *= 1.5"
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
};