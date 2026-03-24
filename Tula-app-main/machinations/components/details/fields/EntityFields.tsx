import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FieldComponentProps, StateType, EventType } from '../types';
import { ProbabilisticEffectsEditor } from '../shared/ProbabilisticEffectsEditor';

export const EntityFields = ({ data, onChange }: FieldComponentProps) => {
  const handleStateAdd = () => {
    const newState: StateType = {
      id: crypto.randomUUID(),
      name: '',
      type: 'int',
      range: [0, 100],
    };
    onChange('states', [...(data.states || []), newState]);
  };

  const handleStateRemove = (id: string) => {
    onChange('states', (data.states || []).filter((s: StateType) => s.id !== id));
  };

  const handleStateChange = (id: string, field: string, value: any) => {
    onChange(
      'states',
      (data.states || []).map((s: StateType) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleEventAdd = () => {
    const newEvent: EventType = {
      id: crypto.randomUUID(),
      name: '',
      requires: '',
      effect: '',
      probabilisticEffects: [],
    };
    onChange('events', [...(data.events || []), newEvent]);
  };

  const handleEventRemove = (id: string) => {
    onChange('events', (data.events || []).filter((e: EventType) => e.id !== id));
  };

  const handleEventChange = (id: string, field: string, value: any) => {
    onChange(
      'events',
      (data.events || []).map((e: EventType) =>
        e.id === id ? { ...e, [field]: value } : e
      )
    );
  };

  const handleEventProbEffectChange = (eventId: string, effects: any[]) => {
    onChange(
      'events',
      (data.events || []).map((e: EventType) =>
        e.id === eventId ? { ...e, probabilisticEffects: effects } : e
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="entity-name">Name</Label>
        <Input
          id="entity-name"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      {/* States */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-base font-semibold">States</Label>
          <Button variant="outline" size="sm" onClick={handleStateAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add State
          </Button>
        </div>
        {(data.states || []).map((state: StateType) => (
          <Card key={state.id} className="relative">
            <CardHeader className="p-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">{state.name || 'New State'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleStateRemove(state.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">State Name</Label>
                <Input
                  value={state.name}
                  onChange={(e) => handleStateChange(state.id, 'name', e.target.value)}
                  placeholder="e.g., Health"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select
                  value={state.type}
                  onValueChange={(v) => handleStateChange(state.id, 'type', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="int">Integer</SelectItem>
                    <SelectItem value="enum">Enumeration</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {state.type === 'int' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Min</Label>
                    <Input
                      type="number"
                      value={state.range?.[0] ?? 0}
                      onChange={(e) =>
                        handleStateChange(state.id, 'range', [
                          parseInt(e.target.value) || 0,
                          state.range?.[1] ?? 100,
                        ])
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max</Label>
                    <Input
                      type="number"
                      value={state.range?.[1] ?? 100}
                      onChange={(e) =>
                        handleStateChange(state.id, 'range', [
                          state.range?.[0] ?? 0,
                          parseInt(e.target.value) || 100,
                        ])
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              )}
              {state.type === 'enum' && (
                <div className="space-y-2">
                  <Label className="text-xs">Enum Values</Label>
                  {(state.enumValues || []).map((val: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={val}
                        onChange={(e) => {
                          const newVals = [...(state.enumValues || [])];
                          newVals[idx] = e.target.value;
                          handleStateChange(state.id, 'enumValues', newVals);
                        }}
                        placeholder={`Value ${idx + 1}`}
                        className="text-sm flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newVals = [...(state.enumValues || [])];
                          newVals.splice(idx, 1);
                          handleStateChange(state.id, 'enumValues', newVals);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newVals = [...(state.enumValues || []), ''];
                      handleStateChange(state.id, 'enumValues', newVals);
                    }}
                    className="w-full"
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add Value
                  </Button>
                </div>
              )}
              {state.type === 'list' && (
                <div className="space-y-1">
                  <Label className="text-xs">List Type (Entity name)</Label>
                  <Input
                    value={state.listType || ''}
                    onChange={(e) => handleStateChange(state.id, 'listType', e.target.value)}
                    placeholder="e.g., Card"
                    className="text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-base font-semibold">Events</Label>
          <Button variant="outline" size="sm" onClick={handleEventAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
        {(data.events || []).map((event: EventType) => (
          <Card key={event.id} className="relative">
            <CardHeader className="p-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">{event.name || 'New Event'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleEventRemove(event.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Event Name</Label>
                <Input
                  value={event.name}
                  onChange={(e) => handleEventChange(event.id, 'name', e.target.value)}
                  placeholder="e.g., Attack"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Requires (condition)</Label>
                <textarea
                  value={event.requires || ''}
                  onChange={(e) => handleEventChange(event.id, 'requires', e.target.value)}
                  placeholder="e.g., Player.Mana >= 1"
                  className="font-mono text-xs w-full p-2 border rounded"
                  rows={2}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Default Effect</Label>
                <textarea
                  value={event.effect || ''}
                  onChange={(e) => handleEventChange(event.id, 'effect', e.target.value)}
                  placeholder="e.g., Target.Health -= Self.Attack"
                  className="font-mono text-xs w-full p-2 border rounded"
                  rows={2}
                />
              </div>
              <ProbabilisticEffectsEditor
                effects={event.probabilisticEffects || []}
                onChange={(effects) => handleEventProbEffectChange(event.id, effects)}
                label="Probabilistic Effects"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};