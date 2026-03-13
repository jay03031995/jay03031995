import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl font-black text-blue-600 mb-6">HyperChat AI</h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-12">
        The AI-first conversation platform designed to replace traditional live chat.
        Automate leads, support, and sales with context-aware AI agents.
      </p>

      <div className="flex gap-4">
        <Link
          href="/dashboard/inbox"
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
        >
          View Live Dashboard
        </Link>
        <Link
          href="/dashboard/training"
          className="bg-gray-100 text-gray-800 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          AI Training Center
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl">
        <div className="p-6 border rounded-2xl">
          <h3 className="font-bold text-xl mb-2">Unified Inbox</h3>
          <p className="text-gray-500">WhatsApp, Instagram, FB, and Web Chat in one place.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-bold text-xl mb-2">AI Knowledge Builder</h3>
          <p className="text-gray-500">Crawl your website and train your agent in seconds.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-bold text-xl mb-2">Lead Capture</h3>
          <p className="text-gray-500">Automated lead qualification with CRM sync.</p>
        </div>
      </div>
    </div>
  );
}
