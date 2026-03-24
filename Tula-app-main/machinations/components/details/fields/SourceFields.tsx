import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldComponentProps } from '../types';

export const SourceFields = ({ data, onChange }: FieldComponentProps) => {
  return (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="main">Main</TabsTrigger>
        <TabsTrigger value="distribution">Distribution</TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="source-name">Name</Label>
          <Input
            id="source-name"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="generation-rate">Generation Rate</Label>
          <Input
            id="generation-rate"
            type="number"
            value={data.generationRate ?? 1}
            onChange={(e) => onChange('generationRate', parseInt(e.target.value))}
          />
        </div>
      </TabsContent>

      <TabsContent value="distribution" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="distribution-type">Distribution Type</Label>
          <Select
            value={data.distributionType || 'deterministic'}
            onValueChange={(v) => onChange('distributionType', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deterministic">Deterministic</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="exponential">Exponential</SelectItem>
              <SelectItem value="temporal">Temporal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.distributionType === 'deterministic' && (
          <div className="space-y-2">
            <Label htmlFor="trigger-event">Trigger Event</Label>
            <Textarea
              id="trigger-event"
              value={data.triggerEvent || ''}
              onChange={(e) => onChange('triggerEvent', e.target.value)}
            />
          </div>
        )}

        {data.distributionType === 'normal' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="mean">Mean</Label>
              <Input
                id="mean"
                type="number"
                value={data.mean ?? 0}
                onChange={(e) => onChange('mean', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stddev">Std Dev</Label>
              <Input
                id="stddev"
                type="number"
                value={data.stddev ?? 1}
                onChange={(e) => onChange('stddev', parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}

        {data.distributionType === 'exponential' && (
          <div className="space-y-2">
            <Label htmlFor="rate">Rate</Label>
            <Input
              id="rate"
              type="number"
              value={data.rate ?? 1}
              onChange={(e) => onChange('rate', parseFloat(e.target.value))}
            />
          </div>
        )}

        {data.distributionType === 'temporal' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="start-turn">Start Turn</Label>
              <Input
                id="start-turn"
                type="number"
                value={data.startTurn ?? 1}
                onChange={(e) => onChange('startTurn', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Interval (turns)</Label>
              <Input
                id="interval"
                type="number"
                value={data.interval ?? 1}
                onChange={(e) => onChange('interval', parseInt(e.target.value))}
              />
            </div>
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};