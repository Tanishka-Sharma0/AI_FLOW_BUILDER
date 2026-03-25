import React, { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { AIService } from '../services/api';
import toast from 'react-hot-toast';

const nodeTypes = {
    custom: CustomNode,
};


interface FlowChartProps {
    onsave: (prompt: string, response: string) => void,
};


const FlowChart: React.FC<FlowChartProps> = ({ onsave }) => {
    const [inputValue, setInputValue] = useState('');
    const [responseValue, setResponseValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const initialNodes: Node[] = useMemo(() => [
        {
            id: 'input-node',
            type: 'custom',
            position: { x: 100, y: 100 },
            data: {
                label: 'Input Node',
                value: inputValue,
                onChange: setInputValue,
                isInput: true,
            },
        },

        {
            id: 'result-node',
            type: 'custom',
            position: { x: 500, y: 100 },
            data: {
                label: 'Result Node',
                value: responseValue,
                isInput: false,
            },
        },

    ], [inputValue, responseValue]);

    const initialEdges: Edge[] = useMemo(() => [
        {
            id: 'edge-1',
            source: 'input-node',
            target: 'result-node',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
        }
    ], []);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === "input-node") {
                    return {
                        ...node,
                        data: { ...node.data, value: inputValue },
                    };
                }
                return node;
            })
        );
    }, [inputValue, setNodes]);


    const onConnect = useCallback((params: Connection) => (setEdges((eds) => addEdge(params, eds))), [setEdges]);
    const updateNodes = useCallback((newInputValue: string, newResponseValue: string) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === 'input-node') {
                    return {
                        ...node,
                        data: { ...node.data, value: newInputValue },
                    };
                }
                if (node.id === 'result-node') {
                    return {
                        ...node,
                        data: { ...node.data, value: newResponseValue },
                    };
                }
                return node;
            })
        );
    }, [setNodes]);

    const handleRunFlow = useCallback(async () => {
        if (!inputValue.trim()) {
            toast.error('Please enter a prompt');
            return;
        }
        setIsLoading(true);
        toast.loading('Generating AI response...', { id: 'ai-generate' });
        try {
            const result = await AIService.generateResponse(inputValue);

            if (result.success && result.data) {
                setResponseValue(result.data.response);
                updateNodes(inputValue, result.data.response);
                toast.success('AI response generated!', { id: 'ai-generate' });
            } else {
                toast.error(result.error || 'Failed to generate response', { id: 'ai-generate' });
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred', { id: 'ai-generate' });
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, updateNodes]);

    const handleSave = useCallback(async () => {
        if (!inputValue || !responseValue) {
            toast.error('Please generate a response first');
            return;
        }
        const result = await AIService.saveConversation(inputValue, responseValue);

        if (result.success) {
            toast.success('Conversation saved to database!');
            onsave(inputValue, responseValue);
        } else {
            toast.error(result.error || 'Failed to save conversation');
        }
    }, [inputValue, responseValue, onsave]);

    return (
        <div className="w-full h-screen relative">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-4">
                <button className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'} text-white shadow-lg`}
                    onClick={handleRunFlow}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Run Flow'}
                </button>

                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg active:transform active:scale-95" onClick={handleSave}>
                    Save to Database
                </button>
            </div>


            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView attributionPosition="bottom-left">
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div >
    )
};



export default FlowChart;

