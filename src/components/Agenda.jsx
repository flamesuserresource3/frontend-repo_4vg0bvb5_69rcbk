import React, { useState } from 'react';

function AgendaForm({ onSubmit, initial, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [date, setDate] = useState(initial?.date || '');
  const [note, setNote] = useState(initial?.note || '');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSubmit({ title: title.trim(), date, note: note.trim() });
    setTitle('');
    setDate('');
    setNote('');
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Judul agenda"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Catatan (opsional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Simpan
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md border px-4 py-2 hover:bg-gray-50">
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

export default function Agenda({ events, onCreate, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Agenda Non-Pelajaran</h2>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-medium">Buat Agenda</h3>
        <AgendaForm onSubmit={onCreate} />
      </div>

      <div>
        <h3 className="mb-2 font-medium">Daftar Agenda</h3>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada agenda.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((ev) => (
              <li key={ev.id} className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                {editingId === ev.id ? (
                  <AgendaForm
                    initial={ev}
                    onSubmit={(data) => {
                      onUpdate(ev.id, data);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-sm text-gray-500">{ev.date}</div>
                      {ev.note && <div className="text-sm text-gray-600">{ev.note}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(ev.id)} className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
                        Edit
                      </button>
                      <button onClick={() => onDelete(ev.id)} className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
                        Hapus
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
