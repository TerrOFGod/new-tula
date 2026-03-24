import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldComponentProps } from '../types';
import { EnumEditor } from '../shared/EnumEditor';

export const StateFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="state-name">Name</Label>
        <Input
          id="state-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value-type">Value Type</Label>
        <Select
          value={data.valueType || 'int'}
          onValueChange={(v) => onChange('valueType', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="int">Integer</SelectItem>
            <SelectItem value="enum">Enumeration</SelectItem>
            <SelectItem value="list">List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.valueType === 'int' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="min">Min</Label>
            <Input
              id="min"
              type="number"
              value={data.range?.[0] || 0}
              onChange={(e) => onChange('range', [parseInt(e.target.value), data.range?.[1]])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">Max</Label>
            <Input
              id="max"
              type="number"
              value={data.range?.[1] || 100}
              onChange={(e) => onChange('range', [data.range?.[0], parseInt(e.target.value)])}
            />
          </div>
        </div>
      )}

      {data.valueType === 'enum' && (
        <EnumEditor
          values={data.enumValues || []}
          onChange={(values) => onChange('enumValues', values)}
        />
      )}

      {data.valueType === 'list' && (
        <div className="space-y-2">
          <Label htmlFor="list-type">List Type (Entity name)</Label>
          <Input
            id="list-type"
            value={data.listType || ''}
            onChange={(e) => onChange('listType', e.target.value)}
            placeholder="e.g., Card"
          />
        </div>
      )}
    </div>
  );
};