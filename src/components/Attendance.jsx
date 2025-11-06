import React, { useMemo } from 'react';

const STATUS = [
  { key: 'hadir', label: 'Hadir', color: 'bg-green-100 text-green-700' },
  { key: 'alfa', label: 'Alfa', color: 'bg-red-100 text-red-700' },
  { key: 'izin', label: 'Izin', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'sakit', label: 'Sakit', color: 'bg-blue-100 text-blue-700' },
];

export default function Attendance({ students, entries, onMark }) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Absensi Harian</h2>
        <div className="text-sm text-gray-500">Tanggal: {today}</div>
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-gray-500">Tambahkan siswa terlebih dahulu.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600">
                <th className="px-3 py-2">Nama</th>
                <th className="px-3 py-2">Kelas</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const status = entries[today]?.[s.id] || null;
                return (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="px-3 py-2">{s.name}</td>
                    <td className="px-3 py-2">{s.classroom}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        {STATUS.map((st) => (
                          <button
                            key={st.key}
                            onClick={() => onMark(today, s.id, st.key)}
                            className={`rounded-md px-3 py-1 ${
                              status === st.key
                                ? `${st.color} ring-2 ring-offset-1`
                                : 'border hover:bg-gray-50'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
