// components/NodeDetailsPanel.tsx
"use client";

import { nanoid } from 'nanoid';
import { useEffect, useState } from "react";
import { useNodeDetails } from "@/app/store/use-node-details";
import useStore from "@/app/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/utils/canvas";
import { StructType } from '@/app/types/structs';

// Типы для вероятностных эффектов
interface ProbabilisticEffect {
  id: string;
  effect: string;
  probability: number;
}

interface ConverterProbEffect {
  id: string;
  conversionIn: number;
  conversionOut: number;
  probability: number;
}

export const NodeDetailsPanel = () => {
  const [convEffects, setConvEffects] = useState<ConverterProbEffect[]>([]);

  const { isOpen, nodeId, nodeType, closeDetails } = useNodeDetails();
  const { nodes, updateNodeData } = useStore();
  const [nodeData, setNodeData] = useState<any>(null);
  const [probEffects, setProbEffects] = useState<ProbabilisticEffect[]>([]);
  const [tempStates, setTempStates] = useState<any[]>([]);
  const [tempEvents, setTempEvents] = useState<any[]>([]);

  useEffect(() => {
    if (nodeId) {
      const node = nodes.find((n) => n.id === nodeId);
      setNodeData(node?.data || null);
      // Инициализируем вероятностные эффекты из данных узла
      // Safe initialization for probabilistic effects
      const probs = node?.data?.probabilisticEffects;
      if (Array.isArray(probs)) {
        setProbEffects(probs);
      } else {
        setProbEffects([]);
      }

      // Safe initialization for converter effects
      const convs = node?.data?.converterProbEffects;
      if (Array.isArray(convs)) {
        setConvEffects(convs);
      } else {
        setConvEffects([]);
      }
    }
  }, [nodeId, nodes]);

  if (!isOpen || !nodeId || !nodeData) return null;

  const handleChange = (key: string, value: any) => {
    const updated = { ...nodeData, [key]: value };
    setNodeData(updated);
    updateNodeData(nodeId, updated);
  };

  // ========== states ==========
  const handleStateAdd = () => {
    const current = nodeData.states || [];
    const newState = {
      id: crypto.randomUUID(),
      name: "",
      type: "int",
      range: [0, 100],
      enumValues: [],
      listType: "",
    };
    handleChange("states", [...current, newState]);
  };

  const handleStateRemove = (id: string) => {
    const current = nodeData.states || [];
    handleChange("states", current.filter((s: any) => s.id !== id));
  };

  const handleStateChange = (id: string, field: string, value: any) => {
    const current = nodeData.states || [];
    const updated = current.map((s: any) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    handleChange("states", updated);
  };

  // ========== events ==========
  const handleEventAdd = () => {
    const current = nodeData.events || [];
    const newEvent = {
      id: crypto.randomUUID(),
      name: "",
      requires: "",
      effect: "",
      probabilisticEffects: [],
    };
    handleChange("events", [...current, newEvent]);
  };

  const handleEventRemove = (id: string) => {
    const current = nodeData.events || [];
    handleChange("events", current.filter((e: any) => e.id !== id));
  };

  const handleEventChange = (id: string, field: string, value: any) => {
    const current = nodeData.events || [];
    const updated = current.map((e: any) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    handleChange("events", updated);
  };


  // ========== Массивы (states, events) ==========
  const handleArrayAdd = (field: string) => {
    const current = nodeData[field] || [];
    handleChange(field, [...current, ""]);
  };

  const handleArrayRemove = (field: string, index: number) => {
    const current = nodeData[field] || [];
    handleChange(
      field,
      current.filter((_: any, i: number) => i !== index)
    );
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const current = nodeData[field] || [];
    const newArray = [...current];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  // ========== Вероятностные эффекты ==========
  const handleEventProbEffectChange = (eventId: string, effectId: string, field: string, value: any) => {
    const current = nodeData.events || [];
    const updatedEvents = current.map((e: any) => {
      if (e.id !== eventId) return e;
      const newEffects = (e.probabilisticEffects || []).map((eff: any) =>
        eff.id === effectId ? { ...eff, [field]: value } : eff
      );
      return { ...e, probabilisticEffects: newEffects };
    });
    handleChange("events", updatedEvents);
  };

  const addEventProbEffect = (eventId: string) => {
    const current = nodeData.events || [];
    const updatedEvents = current.map((e: any) => {
      if (e.id !== eventId) return e;
      const newEffect = {
        id: crypto.randomUUID(),
        effect: "",
        probability: 0.5,
      };
      return { ...e, probabilisticEffects: [...(e.probabilisticEffects || []), newEffect] };
    });
    handleChange("events", updatedEvents);
  };

  const removeEventProbEffect = (eventId: string, effectId: string) => {
    const current = nodeData.events || [];
    const updatedEvents = current.map((e: any) => {
      if (e.id !== eventId) return e;
      return { ...e, probabilisticEffects: (e.probabilisticEffects || []).filter((eff: any) => eff.id !== effectId) };
    });
    handleChange("events", updatedEvents);
  };

  const handleProbEffectChange = (id: string, field: keyof ProbabilisticEffect, value: any) => {
    const newEffects = probEffects.map((eff) =>
      eff.id === id ? { ...eff, [field]: value } : eff
    );
    setProbEffects(newEffects);
    handleChange("probabilisticEffects", newEffects);
  };

  const addProbEffect = () => {
    const newEffect: ProbabilisticEffect = {
      id: crypto.randomUUID(),
      effect: "",
      probability: 0.5,
    };
    const newEffects = [...probEffects, newEffect];
    setProbEffects(newEffects);
    handleChange("probabilisticEffects", newEffects);
  };

  const removeProbEffect = (id: string) => {
    const newEffects = probEffects.filter((eff) => eff.id !== id);
    setProbEffects(newEffects);
    handleChange("probabilisticEffects", newEffects);
  };

  // ========== Converter эффекты ==========

  const handleConvEffectChange = (id: string, field: keyof ConverterProbEffect, value: any) => {
  const newEffects = convEffects.map((eff) =>
    eff.id === id ? { ...eff, [field]: value } : eff
  );
  setConvEffects(newEffects);
  handleChange("converterProbEffects", newEffects);
  };

  const addConvEffect = () => {
    const newEffect: ConverterProbEffect = {
      id: nanoid(),
      conversionIn: 1,
      conversionOut: 1,
      probability: 0.5,
    };
    const newEffects = [...convEffects, newEffect];
    setConvEffects(newEffects);
    handleChange("converterProbEffects", newEffects);
  };

  const removeConvEffect = (id: string) => {
    const newEffects = convEffects.filter((eff) => eff.id !== id);
    setConvEffects(newEffects);
    handleChange("converterProbEffects", newEffects);
  };

  // ========== Перечисления (enum) ==========
  const handleEnumAdd = () => {
    const current = nodeData.enumValues || [];
    handleChange("enumValues", [...current, ""]);
  };

  const handleEnumRemove = (index: number) => {
    const current = nodeData.enumValues || [];
    handleChange(
      "enumValues",
      current.filter((_: any, i: number) => i !== index)
    );
  };

  const handleEnumChange = (index: number, value: string) => {
    const current = nodeData.enumValues || [];
    const newArray = [...current];
    newArray[index] = value;
    handleChange("enumValues", newArray);
  };

  // ========== SUBFLOW ==========
  // Внутри NodeDetailsPanel, после получения nodeId и nodeData

  // ========== Рендер полей по типу ==========

  const renderEntityFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="entity-name">Name</Label>
        <Input
          id="entity-name"
          value={nodeData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
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
        {(nodeData.states || []).map((state: any) => (
          <Card key={state.id} className="relative">
            <CardHeader className="p-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">
                {state.name || "New State"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStateRemove(state.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">State Name</Label>
                <Input
                  value={state.name}
                  onChange={(e) =>
                    handleStateChange(state.id, "name", e.target.value)
                  }
                  placeholder="e.g., Health"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select
                  value={state.type}
                  onValueChange={(v) =>
                    handleStateChange(state.id, "type", v)
                  }
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
              {state.type === "int" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Min</Label>
                    <Input
                      type="number"
                      value={state.range?.[0] ?? 0}
                      onChange={(e) =>
                        handleStateChange(state.id, "range", [
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
                        handleStateChange(state.id, "range", [
                          state.range?.[0] ?? 0,
                          parseInt(e.target.value) || 100,
                        ])
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              )}
              {state.type === "enum" && (
                <div className="space-y-2">
                  <Label className="text-xs">Enum Values</Label>
                  {(state.enumValues || []).map((val: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={val}
                        onChange={(e) => {
                          const newVals = [...(state.enumValues || [])];
                          newVals[idx] = e.target.value;
                          handleStateChange(state.id, "enumValues", newVals);
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
                          handleStateChange(state.id, "enumValues", newVals);
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
                      const newVals = [...(state.enumValues || []), ""];
                      handleStateChange(state.id, "enumValues", newVals);
                    }}
                    className="w-full"
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add Value
                  </Button>
                </div>
              )}
              {state.type === "list" && (
                <div className="space-y-1">
                  <Label className="text-xs">List Type (Entity name)</Label>
                  <Input
                    value={state.listType || ""}
                    onChange={(e) =>
                      handleStateChange(state.id, "listType", e.target.value)
                    }
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
        {(nodeData.events || []).map((event: any) => (
          <Card key={event.id} className="relative">
            <CardHeader className="p-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">
                {event.name || "New Event"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEventRemove(event.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Event Name</Label>
                <Input
                  value={event.name}
                  onChange={(e) =>
                    handleEventChange(event.id, "name", e.target.value)
                  }
                  placeholder="e.g., Attack"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Requires (condition)</Label>
                <Textarea
                  value={event.requires || ""}
                  onChange={(e) =>
                    handleEventChange(event.id, "requires", e.target.value)
                  }
                  placeholder="e.g., Player.Mana >= 1"
                  className="font-mono text-xs"
                  rows={2}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Default Effect</Label>
                <Textarea
                  value={event.effect || ""}
                  onChange={(e) =>
                    handleEventChange(event.id, "effect", e.target.value)
                  }
                  placeholder="e.g., Target.Health -= Self.Attack"
                  className="font-mono text-xs"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Probabilistic Effects</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addEventProbEffect(event.id)}
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add Effect
                  </Button>
                </div>
                {(event.probabilisticEffects || []).map((eff: any, idx: number) => (
                  <div key={eff.id} className="border rounded-md p-2 space-y-2 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Effect #{idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEventProbEffect(event.id, eff.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Effect</Label>
                      <Textarea
                        value={eff.effect}
                        onChange={(e) =>
                          handleEventProbEffectChange(
                            event.id,
                            eff.id,
                            "effect",
                            e.target.value
                          )
                        }
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
                        onChange={(e) =>
                          handleEventProbEffectChange(
                            event.id,
                            eff.id,
                            "probability",
                            parseFloat(e.target.value)
                          )
                        }
                        className="h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStateFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valueType">Value Type</Label>
        <Select value={nodeData.valueType} onValueChange={(v) => handleChange("valueType", v)}>
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

      {nodeData.valueType === "int" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="min">Min</Label>
            <Input
              id="min"
              type="number"
              value={nodeData.range?.[0] || 0}
              onChange={(e) => handleChange("range", [parseInt(e.target.value), nodeData.range?.[1]])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">Max</Label>
            <Input
              id="max"
              type="number"
              value={nodeData.range?.[1] || 100}
              onChange={(e) => handleChange("range", [nodeData.range?.[0], parseInt(e.target.value)])}
            />
          </div>
        </div>
      )}

      {nodeData.valueType === "enum" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Enum Values</Label>
            <Button variant="outline" size="sm" onClick={handleEnumAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Value
            </Button>
          </div>
          {(nodeData.enumValues || []).map((value: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <Input
                value={value}
                onChange={(e) => handleEnumChange(index, e.target.value)}
                placeholder={`Value ${index + 1}`}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => handleEnumRemove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEventFields = () => (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="main">Main</TabsTrigger>
        <TabsTrigger value="probabilistic">Probabilities</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requires">Requires (condition)</Label>
          <Textarea
            id="requires"
            value={nodeData.requires || ""}
            onChange={(e) => handleChange("requires", e.target.value)}
            placeholder="e.g., Player.Mana >= 1"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effect">Default Effect</Label>
          <Textarea
            id="effect"
            value={nodeData.effect || ""}
            onChange={(e) => handleChange("effect", e.target.value)}
            placeholder="e.g., Target.Health -= Self.Attack"
            className="font-mono text-sm"
          />
        </div>
      </TabsContent>

      <TabsContent value="probabilistic" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <Label>Probabilistic Effects</Label>
          <Button variant="outline" size="sm" onClick={addProbEffect}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Effect
          </Button>
        </div>
        {probEffects.map((eff, index) => (
          <Card key={eff.id} className="relative">
            <CardHeader className="p-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Effect #{index + 1}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeProbEffect(eff.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">Effect</Label>
                <Textarea
                  value={eff.effect}
                  onChange={(e) => handleProbEffectChange(eff.id, "effect", e.target.value)}
                  placeholder="e.g., Self.Health -= Target.Attack"
                  className="font-mono text-xs"
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
                  onChange={(e) => handleProbEffectChange(eff.id, "probability", parseFloat(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="cooldown">Cooldown (turns)</Label>
          <Input
            id="cooldown"
            type="number"
            min="0"
            value={nodeData.cooldown || 0}
            onChange={(e) => handleChange("cooldown", parseInt(e.target.value))}
          />
        </div>
        {/* Можно добавить другие поля */}
      </TabsContent>
    </Tabs>
  );

  const renderRuleFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="when">When (condition)</Label>
        <Textarea
          id="when"
          value={nodeData.when || ""}
          onChange={(e) => handleChange("when", e.target.value)}
          placeholder="e.g., Attacker.Element = Fire and Target.Element = Air"
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="effect">Effect</Label>
        <Textarea
          id="effect"
          value={nodeData.effect || ""}
          onChange={(e) => handleChange("effect", e.target.value)}
          placeholder="e.g., Attacker.Attack *= 1.5"
          className="font-mono text-sm"
        />
      </div>
    </div>
  );

  const renderOperatorFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="operator">Operator</Label>
        <Select value={nodeData.operator || "X"} onValueChange={(v) => handleChange("operator", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="X">X (Next)</SelectItem>
            <SelectItem value="F">F (Future)</SelectItem>
            <SelectItem value="G">G (Globally)</SelectItem>
            <SelectItem value="U">U (Until)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* При необходимости добавить поля для аргументов */}
    </div>
  );

const renderSourceFields = () => (
  <Tabs defaultValue="main" className="w-full">
    <TabsList className="grid grid-cols-2">
      <TabsTrigger value="main">Main</TabsTrigger>
      <TabsTrigger value="distribution">Distribution</TabsTrigger>
    </TabsList>
    <TabsContent value="main" className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="generationRate">Generation Rate</Label>
        <Input id="generationRate" type="number" value={nodeData.generationRate ?? 1} onChange={(e) => handleChange("generationRate", parseInt(e.target.value))} />
      </div>
    </TabsContent>
    <TabsContent value="distribution" className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="distributionType">Distribution Type</Label>
        <Select value={nodeData.distributionType || "deterministic"} onValueChange={(v) => handleChange("distributionType", v)}>
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
      {nodeData.distributionType === "deterministic" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="triggerEvent">Trigger</Label>
            <Textarea id="triggerEvent" value={nodeData.triggerEvent || ""} onChange={(e) => handleChange("triggerEvent", e.target.value)} />
          </div>
        </div>
      )}
      {nodeData.distributionType === "normal" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="mean">Mean</Label>
            <Input id="mean" type="number" value={nodeData.mean ?? 0} onChange={(e) => handleChange("mean", parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stddev">Std Dev</Label>
            <Input id="stddev" type="number" value={nodeData.stddev ?? 1} onChange={(e) => handleChange("stddev", parseFloat(e.target.value))} />
          </div>
        </div>
      )}
      {nodeData.distributionType === "exponential" && (
        <div className="space-y-2">
          <Label htmlFor="rate">Rate</Label>
          <Input id="rate" type="number" value={nodeData.rate ?? 1} onChange={(e) => handleChange("rate", parseFloat(e.target.value))} />
        </div>
      )}
      {nodeData.distributionType === "temporal" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="startTurn">Start Turn</Label>
            <Input id="startTurn" type="number" value={nodeData.startTurn ?? 1} onChange={(e) => handleChange("startTurn", parseInt(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval">Interval (turns)</Label>
            <Input id="interval" type="number" value={nodeData.interval ?? 1} onChange={(e) => handleChange("interval", parseInt(e.target.value))} />
          </div>
        </>
      )}
    </TabsContent>
  </Tabs>
);

const renderPoolFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="resourceType">Resource Type</Label>
      <Input id="resourceType" value={nodeData.resourceType || ""} onChange={(e) => handleChange("resourceType", e.target.value)} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-2">
        <Label htmlFor="min">Min</Label>
        <Input id="min" type="number" value={nodeData.min ?? 0} onChange={(e) => handleChange("min", parseInt(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max">Max</Label>
        <Input id="max" type="number" value={nodeData.max ?? 100} onChange={(e) => handleChange("max", parseInt(e.target.value))} />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="initialValue">Initial Value</Label>
      <Input id="initialValue" type="number" value={nodeData.initialValue ?? 0} onChange={(e) => handleChange("initialValue", parseInt(e.target.value))} />
    </div>
  </div>
);

const renderConsumerFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="consumptionAmount">Consumption Amount</Label>
      <Input id="consumptionAmount" type="number" value={nodeData.consumptionAmount ?? 1} onChange={(e) => handleChange("consumptionAmount", parseInt(e.target.value))} />
      <p className="text-xs text-gray-500">Amount consumed per activation. If not specified, uses edge value.</p>
    </div>
  </div>
);

const renderConverterFields = () => (
  <Tabs defaultValue="main" className="w-full">
    <TabsList className="grid grid-cols-2">
      <TabsTrigger value="main">Main</TabsTrigger>
      <TabsTrigger value="probabilistic">Probabilities</TabsTrigger>
    </TabsList>
    <TabsContent value="main" className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conversionRatio">Default Ratio (in:out)</Label>
        <div className="flex gap-2">
          <Input type="number" value={nodeData.conversionIn ?? 1} onChange={(e) => handleChange("conversionIn", parseInt(e.target.value))} className="w-20" />
          <span>:</span>
          <Input type="number" value={nodeData.conversionOut ?? 1} onChange={(e) => handleChange("conversionOut", parseInt(e.target.value))} className="w-20" />
        </div>
      </div>
    </TabsContent>
    <TabsContent value="probabilistic" className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <Label>Probabilistic Effects</Label>
        <Button variant="outline" size="sm" onClick={addConvEffect}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Effect
        </Button>
      </div>
      {convEffects.map((eff, index) => (
        <Card key={eff.id} className="relative">
          <CardHeader className="p-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Effect #{index + 1}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => removeConvEffect(eff.id)}>
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
                  onChange={(e) => handleConvEffectChange(eff.id, "conversionIn", parseInt(e.target.value))}
                  className="w-20"
                />
                <span>:</span>
                <Input
                  type="number"
                  value={eff.conversionOut}
                  onChange={(e) => handleConvEffectChange(eff.id, "conversionOut", parseInt(e.target.value))}
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
                onChange={(e) => handleConvEffectChange(eff.id, "probability", parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </TabsContent>
  </Tabs>
);

const renderGateFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="gateType">Routing Type</Label>
      <Select value={nodeData.gateType || "probabilistic"} onValueChange={(v) => handleChange("gateType", v)}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="probabilistic">Probabilistic</SelectItem>
          <SelectItem value="conditional">Conditional</SelectItem>
        </SelectContent>
      </Select>
      {nodeData.gateType === "conditional" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Textarea id="condition" value={nodeData.condition || ""} onChange={(e) => handleChange("condition", e.target.value)} />
          </div>
        </div>
      )}
    </div>
  </div>
);

const renderDelayFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="delaySteps">Delay Steps</Label>
      <Input id="delaySteps" type="number" min="0" value={nodeData.delaySteps ?? 1} onChange={(e) => handleChange("delaySteps", parseInt(e.target.value))} />
    </div>
  </div>
);

const renderEndFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="endType">End Condition Type</Label>
      <Select value={nodeData.endType || "win"} onValueChange={(v) => handleChange("endType", v)}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="win">Win</SelectItem>
          <SelectItem value="lose">Lose</SelectItem>
          <SelectItem value="draw">Draw</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const renderTriggerFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="triggerEvent">Trigger Event</Label>
      <Input id="triggerEvent" value={nodeData.triggerEvent || ""} onChange={(e) => handleChange("triggerEvent", e.target.value)} />
      <p className="text-xs text-gray-500">Name of the event that triggers this node.</p>
    </div>
  </div>
);

  return (
    <div className="absolute top-20 right-4 w-96 bg-white rounded-lg shadow-xl p-4 z-50 border max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg capitalize">{nodeType} Properties</h3>
        <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">
          ✖
        </button>
      </div>
      <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
        <div className="space-y-6">
          {nodeType === "entity" && renderEntityFields()}
          {nodeType === "state" && renderStateFields()}
          {nodeType === "event" && renderEventFields()}
          {nodeType === "rule" && renderRuleFields()}
          {nodeType === "operator" && renderOperatorFields()}

          {nodeType === "source" && renderSourceFields()}
          {nodeType === "pool" && renderPoolFields()}
          {nodeType === "consumer" && renderConsumerFields()}
          {nodeType === "converter" && renderConverterFields()}
          {nodeType === "gate" && renderGateFields()}
          {nodeType === "delay" && renderDelayFields()}
          {nodeType === "end" && renderEndFields()}
          {nodeType === "trigger" && renderTriggerFields()}

          <Separator />

          {/* Блок аналитики (можно оставить) */}
          <div>
            <h4 className="font-semibold mb-2">Analytics</h4>
            <div className="bg-gray-50 p-2 rounded text-sm text-gray-600">
              Simulation data will appear here.
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};