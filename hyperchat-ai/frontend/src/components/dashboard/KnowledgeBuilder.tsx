"use client";

import React, { useState } from 'react';
import { Upload, Globe, CheckCircle, Loader2 } from 'lucide-react';

export default function KnowledgeBuilder() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleCrawl = async () => {
    setLoading(true);
    // Simulate API call to crawl
    setTimeout(() => {
      setLoading(false);
      setComplete(true);
    }, 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">AI Training Center</h1>
      <p className="text-gray-500 mb-8">Train your AI agent by providing your website URL or uploading documentation.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* URL Crawling */}
        <div className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
            <Globe size={24} />
          </div>
          <h3 className="font-bold mb-2">Website URL</h3>
          <p className="text-sm text-gray-500 mb-4">Crawl your entire website to extract knowledge automatically.</p>
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCrawl}
            disabled={loading || !url}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={20} /> Crawling...</> : 'Start Crawling'}
          </button>
        </div>

        {/* PDF Upload */}
        <div className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center text-purple-600 mb-4">
            <Upload size={24} />
          </div>
          <h3 className="font-bold mb-2">Upload PDFs</h3>
          <p className="text-sm text-gray-500 mb-4">Upload product manuals, FAQs, or policy documents.</p>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400">
            <Upload size={32} className="mb-2" />
            <span className="text-sm">Click to upload files</span>
          </div>
        </div>
      </div>

      {complete && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-700">
          <CheckCircle size={20} />
          <span>Knowledge base updated successfully! Your AI agent is now trained on the new data.</span>
        </div>
      )}
    </div>
  );
}
