'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Download, Loader2, CheckCircle, AlertCircle, MapPin } from 'lucide-react';

export default function MapScraperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Upload failed');
      }

      const data = await response.json();
      setJobId(data.job_id);
      localStorage.setItem('mapScraperJobId', data.job_id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedJobId = localStorage.getItem('mapScraperJobId');
    if (savedJobId) setJobId(savedJobId);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (jobId) {
      const checkStatus = async () => {
        try {
          const response = await fetch(`http://localhost:8000/job/${jobId}`);
          if (response.ok) {
            const data = await response.json();
            setStatus(data);
            if (data.status === 'completed') {
              // Optionally stop interval if completed, but maybe keep it to show 100%
            }
          }
        } catch (err) {
          console.error('Error fetching job status:', err);
        }
      };

      checkStatus();
      interval = setInterval(checkStatus, 3000);
    }

    return () => clearInterval(interval);
  }, [jobId]);

  const handleDownload = () => {
    if (!jobId) return;
    window.location.href = `http://localhost:8000/job/${jobId}/download`;
  };

  const resetJob = () => {
    setJobId(null);
    setStatus(null);
    setFile(null);
    localStorage.removeItem('mapScraperJobId');
  };

  const progress = status ? (status.processed_rows / status.total_rows) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#121330] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#E32626] rounded-xl">
            <MapPin className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Google Maps Link Scraper</h1>
            <p className="text-gray-400">Enrich your business data with official Google Maps links</p>
          </div>
        </div>

        {!jobId ? (
          <div className="bg-[#1a1b3b] rounded-2xl p-8 border border-white/10 glass-effect">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">Upload CSV</label>
              <div className="relative group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#E32626]/50 hover:bg-[#E32626]/5 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-gray-400 group-hover:text-[#E32626]" />
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV file with 'Business Name' and 'Address' columns</p>
                  </div>
                </label>
              </div>
              {file && (
                <div className="mt-4 p-3 bg-[#E32626]/10 rounded-lg flex items-center justify-between border border-[#E32626]/20">
                  <span className="text-sm">{file.name}</span>
                  <button onClick={() => setFile(null)} className="text-xs text-[#E32626] hover:underline">Remove</button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full py-4 bg-[#E32626] hover:bg-[#c21e1e] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Scraping'}
            </button>
          </div>
        ) : (
          <div className="bg-[#1a1b3b] rounded-2xl p-8 border border-white/10 glass-effect">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-1">Scraping in progress...</h2>
                <p className="text-sm text-gray-400 italic">This may take a while to avoid Google blocking.</p>
              </div>
              <button onClick={resetJob} className="text-sm text-gray-400 hover:text-white transition-colors">Start New Job</button>
            </div>

            <div className="space-y-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#E32626] bg-[#E32626]/10">
                      {status?.status === 'completed' ? 'Completed' : 'Processing'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-400">
                      {status?.processed_rows || 0} / {status?.total_rows || 0} Rows
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/5">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#E32626] transition-all duration-500"
                  ></div>
                </div>
              </div>

              {status?.status === 'completed' ? (
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl flex flex-col items-center gap-4 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                  <div>
                    <h3 className="text-lg font-bold text-green-400">All Done!</h3>
                    <p className="text-sm text-gray-400">Your enriched CSV is ready for download.</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-8 py-3 bg-[#E32626] hover:bg-[#c21e1e] rounded-lg font-bold flex items-center gap-2 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download Enriched CSV
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 text-[#E32626] animate-spin" />
                  <p className="text-sm text-gray-400">Processing row {status?.processed_rows + 1} of {status?.total_rows}...</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="font-semibold text-sm mb-2 text-gray-300">Name & Address</h4>
            <p className="text-xs text-gray-500">The scraper uses both business name and address for pinpoint accuracy.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="font-semibold text-sm mb-2 text-gray-300">Anti-Blocking</h4>
            <p className="text-xs text-gray-500">Includes human-like delays and rotation to prevent IP restrictions.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="font-semibold text-sm mb-2 text-gray-300">Share Links</h4>
            <p className="text-xs text-gray-500">Automatically extracts the official shortened maps.app.goo.gl links.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
