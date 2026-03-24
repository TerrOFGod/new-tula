import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ProbabilisticEffect } from '../types';

interface ProbabilisticEffectsEditorProps {
  effects: ProbabilisticEffect[];
  onChange: (effects: ProbabilisticEffect[]) => void;
  label?: string;
}

export const ProbabilisticEffectsEditor = ({
  effects,
  onChange,
  label = 'Probabilistic Effects',
}: ProbabilisticEffectsEditorProps) => {
  const addEffect = () => {
    const newEffect: ProbabilisticEffect = {
      id: crypto.randomUUID(),
      effect: '',
      probability: 0.5,
    };
    onChange([...effects, newEffect]);
  };

  const removeEffect = (id: string) => {
    onChange(effects.filter((eff) => eff.id !== id));
  };

  const updateEffect = (id: string, field: keyof ProbabilisticEffect, value: any) => {
    onChange(
      effects.map((eff) =>
        eff.id === id ? { ...eff, [field]: value } : eff
      )
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <Button variant="outline" size="sm" onClick={addEffect}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Effect
        </Button>
      </div>
      {effects.map((eff, index) => (
        <Card key={eff.id} className="relative">
          <CardHeader className="p-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Effect #{index + 1}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => removeEffect(eff.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Effect</Label>
              <Textarea
                value={eff.effect}
                onChange={(e) => updateEffect(eff.id, 'effect', e.target.value)}
                placeholder="e.g., Self.Health -= Target.Attack"
                className="font-mono text-xs"
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Probability (0-1)</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={eff.probability}
                onChange={(e) => updateEffect(eff.id, 'probability', parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};