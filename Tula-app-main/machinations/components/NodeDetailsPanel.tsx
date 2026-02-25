"use client";
import { useEffect, useState } from "react";
import { useNodeDetails } from "@/app/store/use-node-details";
import useStore from "@/app/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Metrics } from "@/app/test/[boardId]/_components/metrics/metrics"; // пример

export const NodeDetailsPanel = () => {
  const { isOpen, nodeId, nodeType, closeDetails } = useNodeDetails();
  const { nodes, updateNodeData } = useStore(); // предположим, есть функция updateNodeData
  const [nodeData, setNodeData] = useState<any>(null);

  useEffect(() => {
    if (nodeId) {
      const node = nodes.find(n => n.id === nodeId);
      setNodeData(node?.data);
    }
  }, [nodeId, nodes]);

  if (!isOpen || !nodeId) return null;

  const handleChange = (key: string, value: any) => {
    const updated = { ...nodeData, [key]: value };
    setNodeData(updated);
    updateNodeData(nodeId, updated);
  };

  const renderEntityFields = () => (
    <>
      <label>Name:</label>
      <Input value={nodeData?.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
      <label>States (comma separated):</label>
      <Input value={nodeData?.states?.join(', ') || ''} onChange={(e) => handleChange('states', e.target.value.split(',').map(s => s.trim()))} />
      <label>Events:</label>
      <Input value={nodeData?.events?.join(', ') || ''} onChange={(e) => handleChange('events', e.target.value.split(',').map(s => s.trim()))} />
    </>
  );

  const renderStateFields = () => (
    <>
      <label>Name:</label>
      <Input value={nodeData?.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
      <label>Value Type:</label>
      <select value={nodeData?.valueType} onChange={(e) => handleChange('valueType', e.target.value)}>
        <option value="int">Int</option>
        <option value="enum">Enum</option>
        <option value="list">List</option>
      </select>
      {nodeData?.valueType === 'int' && (
        <>
          <label>Min:</label>
          <Input type="number" value={nodeData?.range?.[0] || 0} onChange={(e) => handleChange('range', [parseInt(e.target.value), nodeData?.range?.[1]])} />
          <label>Max:</label>
          <Input type="number" value={nodeData?.range?.[1] || 100} onChange={(e) => handleChange('range', [nodeData?.range?.[0], parseInt(e.target.value)])} />
        </>
      )}
      {nodeData?.valueType === 'enum' && (
        <>
          <label>Enum values (comma):</label>
          <Input value={nodeData?.enumValues?.join(', ') || ''} onChange={(e) => handleChange('enumValues', e.target.value.split(',').map(s => s.trim()))} />
        </>
      )}
    </>
  );

  const renderEventFields = () => (
    <>
      <label>Name:</label>
      <Input value={nodeData?.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
      <label>Requires:</label>
      <Input value={nodeData?.requires || ''} onChange={(e) => handleChange('requires', e.target.value)} />
      <label>Effect:</label>
      <Input value={nodeData?.effect || ''} onChange={(e) => handleChange('effect', e.target.value)} />
      <label>Probability (0-1):</label>
      <Input type="number" min="0" max="1" step="0.1" value={nodeData?.probability || 0.5} onChange={(e) => handleChange('probability', parseFloat(e.target.value))} />
    </>
  );

  const renderRuleFields = () => (
    <>
      <label>Name:</label>
      <Input value={nodeData?.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
      <label>When:</label>
      <Input value={nodeData?.when || ''} onChange={(e) => handleChange('when', e.target.value)} />
      <label>Effect:</label>
      <Input value={nodeData?.effect || ''} onChange={(e) => handleChange('effect', e.target.value)} />
    </>
  );

  const renderOperatorFields = () => (
    <>
      <label>Operator:</label>
      <select value={nodeData?.operator || 'X'} onChange={(e) => handleChange('operator', e.target.value)}>
        <option value="X">X (Next)</option>
        <option value="F">F (Future)</option>
        <option value="G">G (Globally)</option>
        <option value="U">U (Until)</option>
      </select>
    </>
  );

  return (
    <div className="absolute top-20 right-4 w-96 bg-white rounded-lg shadow-xl p-4 z-50 border max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Node Details: {nodeType}</h3>
        <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">✖</button>
      </div>
      <div className="space-y-3">
        {nodeType === 'entity' && renderEntityFields()}
        {nodeType === 'state' && renderStateFields()}
        {nodeType === 'event' && renderEventFields()}
        {nodeType === 'rule' && renderRuleFields()}
        {nodeType === 'operator' && renderOperatorFields()}
      </div>
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Analytics</h4>
        {/* Здесь можно встроить существующие компоненты аналитики, например Metrics или упрощённый вариант */}
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-sm text-gray-600">Simulation data will appear here.</p>
          {/* Пример: <Metrics nodeId={nodeId} /> */}
        </div>
      </div>
    </div>
  );
};