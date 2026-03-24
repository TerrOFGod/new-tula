import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FieldComponentProps, ConverterProbEffect } from '../types';
import { ConverterProbEffectsEditor } from '../shared/ConverterProbEffectsEditor';
import { useState } from 'react';

export const ConverterFields = ({ data, onChange }: FieldComponentProps) => {
  const [convEffects, setConvEffects] = useState<ConverterProbEffect[]>(
    data.converterProbEffects || []
  );

  const handleConvEffectsChange = (effects: ConverterProbEffect[]) => {
    setConvEffects(effects);
    onChange('converterProbEffects', effects);
  };

  return (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="main">Main</TabsTrigger>
        <TabsTrigger value="probabilistic">Probabilities</TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="converter-name">Name</Label>
          <Input
            id="converter-name"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Default Ratio (in:out)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={data.conversionIn ?? 1}
              onChange={(e) => onChange('conversionIn', parseInt(e.target.value))}
              className="w-20"
            />
            <span>:</span>
            <Input
              type="number"
              value={data.conversionOut ?? 1}
              onChange={(e) => onChange('conversionOut', parseInt(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="probabilistic" className="space-y-4 mt-4">
        <ConverterProbEffectsEditor
          effects={convEffects}
          onChange={handleConvEffectsChange}
        />
      </TabsContent>
    </Tabs>
  );
};