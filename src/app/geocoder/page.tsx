'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import { MapPin, Upload, FileDown, LogOut, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface CSVRow {
  [key: string]: any;
}

export default function GeocoderDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<CSVRow[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please upload a valid CSV file');
        return;
      }
      setFile(selectedFile);
      setResults(null);
      setProgress(0);
    }
  };

  const processCSV = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (parseResult) => {
        const rows = parseResult.data;
        const totalRows = rows.length;
        const processedData: CSVRow[] = [];

        for (let i = 0; i < totalRows; i++) {
          try {
            const row = rows[i];
            const response = await fetch('/api/geocoder/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ row }),
            });
            const data = await response.json();
            processedData.push({ ...row, ...data });
            setProgress(Math.round(((i + 1) / totalRows) * 100));
          } catch (error) {
            processedData.push({ ...rows[i], status: 'error', error: 'Processing failed' });
          }
        }

        setResults(processedData);
        setProcessing(false);
        toast.success('Processing complete!');
      },
      error: () => {
        toast.error('Error parsing CSV');
        setProcessing(false);
      }
    });
  };

  const downloadResults = () => {
    if (!results) return;
    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'enriched_locations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0F4C75]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Montserrat']">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-[#0F4C75] p-2 rounded-lg">
            <MapPin className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-[#121330]">GeoSwift</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-600">Welcome, <span className="text-[#0F4C75] font-bold">{user?.name}</span></span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#121330] mb-2">Upload Data</h2>
              <p className="text-gray-500 mb-8">Upload a CSV with addresses or coordinates to start processing.</p>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-[#0F4C75] transition-colors group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#0F4C75] transition-colors mb-4" />
                  <p className="text-lg font-semibold text-gray-700">{file ? file.name : 'Click to select CSV file'}</p>
                  <p className="text-sm text-gray-400 mt-1">Supports up to 50MB</p>
                </label>
              </div>

              {file && !results && (
                <Button
                  onClick={processCSV}
                  disabled={processing}
                  className="w-full mt-6 bg-[#0F4C75] hover:bg-[#0D3B5C] py-7 text-lg font-bold rounded-2xl"
                >
                  {processing ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      Processing Rows... {progress}%
                    </span>
                  ) : 'Start Processing'}
                </Button>
              )}

              {processing && (
                <div className="mt-8">
                  <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-[#0D9488] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </section>

            {results && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#121330]">Results</h2>
                    <p className="text-gray-500">Processed {results.length} rows successfully</p>
                  </div>
                  <Button
                    onClick={downloadResults}
                    className="bg-[#0D9488] hover:bg-[#0b7a70] text-white flex items-center space-x-2 rounded-xl py-6 px-6"
                  >
                    <FileDown size={20} />
                    <span className="font-bold">Download CSV</span>
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Input</th>
                        <th className="px-4 py-3">Latitude</th>
                        <th className="px-4 py-3">Longitude</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.slice(0, 5).map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            {row.status === 'success' ? (
                              <CheckCircle2 className="text-green-500 h-5 w-5" />
                            ) : (
                              <AlertCircle className="text-red-500 h-5 w-5" />
                            )}
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-700 truncate max-w-[200px]">
                            {row.Address || row.address || row['Address Line 1'] || 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-gray-600">{row.lat || '—'}</td>
                          <td className="px-4 py-4 text-gray-600">{row.lon || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {results.length > 5 && (
                    <div className="p-4 bg-gray-50 text-center text-xs font-semibold text-gray-400">
                      + {results.length - 5} more rows in the full download
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Adsense Placeholder */}
          <div className="space-y-8">
            <div className="bg-[#0F4C75] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-blue-100 text-sm mb-6">Get faster processing and higher rate limits for large datasets.</p>
                <button className="w-full bg-white text-[#0F4C75] py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <MapPin size={150} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Advertisement</div>
              <div className="w-full h-full bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 italic text-sm p-4">
                {/* Google Adsense Placeholder */}
                Google AdSense Placeholder<br/>[Your Ad Unit Here]
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Ad Placeholder */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-300 text-xs italic">
          Google AdSense Horizontal Banner Placeholder
        </div>
      </div>
    </div>
  );
}
