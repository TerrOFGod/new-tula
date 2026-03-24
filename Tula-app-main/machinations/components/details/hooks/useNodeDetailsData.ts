import { useEffect, useState } from 'react';
import  useStore  from '@/app/store/store';
import { NodeDetailsData } from '../types';

export const useNodeDetailsData = (nodeId: string | null) => {
  const [data, setData] = useState<NodeDetailsData | null>(null);
  const { nodes, updateNodeData } = useStore();

  useEffect(() => {
    if (nodeId) {
      const node = nodes.find((n) => n.id === nodeId);
      const nodeData = node?.data || {};
      
      // Инициализация структур для определенных типов
      if (node?.type === 'entity') {
        if (!nodeData.states) nodeData.states = [];
        if (!nodeData.events) nodeData.events = [];
      }
      
      if (node?.type === 'event') {
        if (!nodeData.probabilisticEffects) nodeData.probabilisticEffects = [];
      }
      
      if (node?.type === 'converter') {
        if (!nodeData.converterProbEffects) nodeData.converterProbEffects = [];
      }
      
      setData(nodeData);
    }
  }, [nodeId, nodes]);

  const handleChange = (key: string, value: any) => {
    if (!nodeId) return;
    
    const updatedData = { ...data, [key]: value };
    setData(updatedData);
    updateNodeData(nodeId, updatedData);
  };

  return { data, handleChange };
};