export default async function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-800">Thread: <span className="text-blue-600">{resolvedParams.id}</span></h2>
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
         <p className="text-slate-500 mb-4 font-medium">You are viewing a specific standalone conversation thread.</p>
         <div className="p-4 bg-blue-50/50 text-blue-800 font-medium rounded-xl text-sm border border-blue-100">
            Please use the main <strong className="font-bold underline">Conversations</strong> inbox view from the sidebar to interact with realtime chats.
         </div>
      </div>
    </div>
  )
}
