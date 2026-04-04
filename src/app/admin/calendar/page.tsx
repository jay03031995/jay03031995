'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  editor?: { name: string | null };
}

interface CalendarEntry {
  id: string;
  date: string;
  videoTopic: string;
  platform: string;
  status: string;
  client: Client;
}

export default function CalendarPage() {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: selectedDate,
    videoTopic: '',
    platform: 'Instagram',
    clientId: ''
  });

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/calendar?date=${selectedDate}`);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      toast.error('Failed to fetch calendar');
    }
  }, [selectedDate]);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchClients();
  }, [fetchEntries, fetchClients]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Sync complete! ${data.results?.length || 0} assignments processed`);
        fetchEntries();
      } else {
        toast.error('Sync failed: ' + (data.details || data.error));
      }
    } catch (err) {
      toast.error('Sync failed');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      if (res.ok) {
        toast.success('Entry added');
        setShowModal(false);
        fetchEntries();
      }
    } catch (err) {
      toast.error('Failed to add entry');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Content Calendar</h1>
        <div className="flex space-x-3">
          <input
            type="date"
            className="rounded-lg border p-2 text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
          <button
            onClick={() => {
              setNewEntry({ ...newEntry, date: selectedDate });
              setShowModal(true);
            }}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Topic</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Editor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No entries for this date</td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{entry.videoTopic}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{entry.platform}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      entry.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                      entry.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{entry.client.editor?.name || 'Unassigned'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Add Calendar Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client</label>
                <select
                  required
                  className="mt-1 w-full rounded-lg border p-2"
                  value={newEntry.clientId}
                  onChange={(e) => setNewEntry({ ...newEntry, clientId: e.target.value })}
                >
                  <option value="">Select a client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Video Topic</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border p-2"
                  value={newEntry.videoTopic}
                  onChange={(e) => setNewEntry({ ...newEntry, videoTopic: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Platform</label>
                <select
                  className="mt-1 w-full rounded-lg border p-2"
                  value={newEntry.platform}
                  onChange={(e) => setNewEntry({ ...newEntry, platform: e.target.value })}
                >
                  <option>Instagram</option>
                  <option>YouTube</option>
                  <option>TikTok</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
