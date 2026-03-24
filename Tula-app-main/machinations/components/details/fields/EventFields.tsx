import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldComponentProps, ProbabilisticEffect } from '../types';
import { ProbabilisticEffectsEditor } from '../shared/ProbabilisticEffectsEditor';

export const EventFields = ({ data, onChange }: FieldComponentProps) => {
  const [probEffects, setProbEffects] = useState<ProbabilisticEffect[]>(
    data.probabilisticEffects || []
  );

  const handleProbEffectsChange = (effects: ProbabilisticEffect[]) => {
    setProbEffects(effects);
    onChange('probabilisticEffects', effects);
  };

  return (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="main">Main</TabsTrigger>
        <TabsTrigger value="probabilistic">Probabilities</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="event-name">Name</Label>
          <Input
            id="event-name"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requires">Requires (condition)</Label>
          <Textarea
            id="requires"
            value={data.requires || ''}
            onChange={(e) => onChange('requires', e.target.value)}
            placeholder="e.g., Player.Mana >= 1"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effect">Default Effect</Label>
          <Textarea
            id="effect"
            value={data.effect || ''}
            onChange={(e) => onChange('effect', e.target.value)}
            placeholder="e.g., Target.Health -= Self.Attack"
            className="font-mono text-sm"
          />
        </div>
      </TabsContent>

      <TabsContent value="probabilistic" className="space-y-4 mt-4">
        <ProbabilisticEffectsEditor
          effects={probEffects}
          onChange={handleProbEffectsChange}
        />
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="cooldown">Cooldown (turns)</Label>
          <Input
            id="cooldown"
            type="number"
            min="0"
            value={data.cooldown || 0}
            onChange={(e) => onChange('cooldown', parseInt(e.target.value))}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};