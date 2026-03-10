'use client';

import { useState, useEffect } from 'react';
import { Plus, User, Folder } from 'lucide-react';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  oneDriveFolder: string | null;
  editor?: { id: string; name: string | null; email: string };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', oneDriveFolder: '', editorId: '' });

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      toast.error('Failed to fetch clients');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (res.ok) {
        toast.success('Client added');
        setShowModal(false);
        fetchClients();
      }
    } catch (err) {
      toast.error('Failed to add client');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div key={client.id} className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{client.name}</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Folder className="mr-2 h-4 w-4" />
                {client.oneDriveFolder || 'No folder set'}
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {client.editor?.name || 'Unassigned'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Add New Client</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border p-2 focus:ring-blue-500"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">OneDrive Folder Path</label>
                <input
                  type="text"
                  placeholder="Clients/ClientName"
                  className="mt-1 w-full rounded-lg border p-2 focus:ring-blue-500"
                  value={newClient.oneDriveFolder}
                  onChange={(e) => setNewClient({ ...newClient, oneDriveFolder: e.target.value })}
                />
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
