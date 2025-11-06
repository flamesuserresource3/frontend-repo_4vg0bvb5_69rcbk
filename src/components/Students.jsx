import React, { useState } from 'react';

function StudentForm({ onSubmit, initial, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [classroom, setClassroom] = useState(initial?.classroom || '');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !classroom.trim()) return;
    onSubmit({ name: name.trim(), classroom: classroom.trim() });
    setName('');
    setClassroom('');
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nama siswa"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kelas (contoh: 5A)"
          value={classroom}
          onChange={(e) => setClassroom(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Simpan
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-gray-50"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

export default function Students({ students, onCreate, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Kelola Siswa</h2>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-medium">Tambah Siswa</h3>
        <StudentForm onSubmit={onCreate} />
      </div>

      <div>
        <h3 className="mb-2 font-medium">Daftar Siswa</h3>
        {students.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada data siswa.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="px-3 py-2">Nama</th>
                  <th className="px-3 py-2">Kelas</th>
                  <th className="px-3 py-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="px-3 py-2 align-top">
                      {editingId === s.id ? (
                        <StudentForm
                          initial={s}
                          onSubmit={(data) => {
                            onUpdate(s.id, data);
                            setEditingId(null);
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <span className="font-medium">{s.name}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">{s.classroom}</td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-2">
                        {editingId === s.id ? null : (
                          <>
                            <button
                              onClick={() => setEditingId(s.id)}
                              className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(s.id)}
                              className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                            >
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
