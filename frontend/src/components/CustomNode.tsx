import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageSquare, Sparkles } from 'lucide-react';


interface CustomNodeData {
    label: string,
    value?: string,
    onChange?: (value: string) => void
    isInput?: boolean
}


const CustomNode = memo(({ data, id }: NodeProps<CustomNodeData>) => {
    const { label, value, onChange, isInput } = data;

    return (
        <div className="relative min-w-[280px]">
            {!isInput && (
                <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
            )}
            <div className={` bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${isInput ? "border-blue-500 hover:shadow-xl" : "border-green-500 hover:shadow-xl"}`}>
                <div className={`  px-4 py-2 rounded-t-lg flex items-center gap-2 ${isInput ? "bg-blue-50 border-b border-blue-200" : "bg-green-50 border-b border-green-200"}`}>
                    {isInput ? (<MessageSquare className="w-4 h-4 text-blue-600" />) : (<Sparkles className="w-4 h-4 text-green-600" />)}
                    <span className="font-semibold text-gray-700">{label}</span>
                </div>

                <div className="p-4">
                    {isInput ? (
                        <textarea
                            value={value || ''}
                            onChange={(e) => onChange && onChange(e.target.value)}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            placeholder="Type your prompt here..."
                            className="nodrag w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                        />
                    ) : (
                        <div className="min-h-[100px] p-2 bg-gray-50 rounded-md text-gray-700 whitespace-pre-wrap">
                            {value || 'Waiting for response...'}
                        </div>
                    )}
                </div>
            </div>
            <Handle type='source' position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
        </div >
    );
});

CustomNode.displayName = 'CustomNode';
export default CustomNode;