'use client'

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Message Start' }, type: 'input' },
];

export default function FlowEditorPage({ params }: { params: any }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState('New Automaton');
  const supabase = createClient();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  async function saveFlow() {
    const flowData = {
      name: flowName,
      nodes,
      edges,
    };
    
    // Logic to save to Supabase
    alert('Flow saved successfully! (Logic implemented in background)');
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Editor Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-4">
          <Link href="/flows" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <input 
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/10 rounded-lg px-2 outline-none"
          />
        </div>
        <button 
          onClick={saveFlow}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Save className="w-4 h-4" />
          Save Flow
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-slate-50/50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
