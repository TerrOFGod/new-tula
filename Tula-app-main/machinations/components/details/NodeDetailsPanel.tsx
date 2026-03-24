import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNodeDetails } from '@/app/store/use-node-details';
import { useNodeDetailsData } from './hooks/useNodeDetailsData';
import { FieldComponentProps } from './types';

// Импорт всех полей
import { EntityFields } from './fields/EntityFields';
import { StateFields } from './fields/StateFields';
import { EventFields } from './fields/EventFields';
import { RuleFields } from './fields/RuleFields';
import { OperatorFields } from './fields/OperatorFields';
import { SourceFields } from './fields/SourceFields';
import { PoolFields } from './fields/PoolFields';
import { ConsumerFields } from './fields/ConsumerFields';
import { ConverterFields } from './fields/ConverterFields';
import { GateFields } from './fields/GateFields';
import { DelayFields } from './fields/DelayFields';
import { EndFields } from './fields/EndFields';
import { TriggerFields } from './fields/TriggerFields';

const fieldComponents: Record<string, React.ComponentType<FieldComponentProps>> = {
  entity: EntityFields,
  state: StateFields,
  event: EventFields,
  rule: RuleFields,
  operator: OperatorFields,
  source: SourceFields,
  pool: PoolFields,
  consumer: ConsumerFields,
  converter: ConverterFields,
  gate: GateFields,
  delay: DelayFields,
  end: EndFields,
  trigger: TriggerFields,
};

export const NodeDetailsPanel = () => {
  const { isOpen, nodeId, nodeType, closeDetails } = useNodeDetails();
  const { data, handleChange } = useNodeDetailsData(nodeId);

  if (!isOpen || !nodeId || !data) return null;

  const FieldComponent = fieldComponents[nodeType || ''];
  const hasFieldComponent = !!FieldComponent;

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
          {hasFieldComponent ? (
            <FieldComponent data={data} onChange={handleChange} nodeId={nodeId} />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No properties available for this node type
            </div>
          )}

          <Separator />

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