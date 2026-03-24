import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ConverterProbEffect } from '../types';

interface ConverterProbEffectsEditorProps {
  effects: ConverterProbEffect[];
  onChange: (effects: ConverterProbEffect[]) => void;
}

export const ConverterProbEffectsEditor = ({
  effects,
  onChange,
}: ConverterProbEffectsEditorProps) => {
  const addEffect = () => {
    const newEffect: ConverterProbEffect = {
      id: crypto.randomUUID(),
      conversionIn: 1,
      conversionOut: 1,
      probability: 0.5,
    };
    onChange([...effects, newEffect]);
  };

  const removeEffect = (id: string) => {
    onChange(effects.filter((eff) => eff.id !== id));
  };

  const updateEffect = (id: string, field: keyof ConverterProbEffect, value: any) => {
    onChange(
      effects.map((eff) =>
        eff.id === id ? { ...eff, [field]: value } : eff
      )
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Probabilistic Conversion Effects</Label>
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
              <Label className="text-xs">Conversion (in:out)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={eff.conversionIn}
                  onChange={(e) => updateEffect(eff.id, 'conversionIn', parseInt(e.target.value))}
                  className="w-20"
                />
                <span>:</span>
                <Input
                  type="number"
                  value={eff.conversionOut}
                  onChange={(e) => updateEffect(eff.id, 'conversionOut', parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
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