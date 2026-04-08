import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold mb-6 text-slate-800">Selvo AI Receptionist</h1>
        <p className="text-xl text-slate-600 mb-8">
          Your 24/7 AI Sales & Support assistant on WhatsApp. Never miss a customer inquiry, booking, or order again.
        </p>
        <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Owner Login
            </Link>
            <Link href="/signup" className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition">
              Get Started
            </Link>
        </div>
      </div>
    </div>
  );
}
