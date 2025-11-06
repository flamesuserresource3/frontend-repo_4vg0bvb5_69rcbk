import React, { useMemo, useState } from 'react';

function GradeForm({ students, onSubmit, initial, onCancel }) {
  const [studentId, setStudentId] = useState(initial?.studentId || (students[0]?.id ?? ''));
  const [subject, setSubject] = useState(initial?.subject || 'Matematika');
  const [score, setScore] = useState(initial?.score?.toString() || '');

  const submit = (e) => {
    e.preventDefault();
    const num = Number(score);
    if (!studentId || !subject.trim() || Number.isNaN(num)) return;
    onSubmit({ studentId, subject: subject.trim(), score: num });
    setScore('');
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name} ({s.classroom})</option>
          ))}
        </select>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mata pelajaran"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          type="number"
          min="0"
          max="100"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nilai (0-100)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Simpan</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md border px-4 py-2 hover:bg-gray-50">Batal</button>
        )}
      </div>
    </form>
  );
}

export default function Grades({ students, grades, onCreate, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  const averages = useMemo(() => {
    const map = {};
    grades.forEach((g) => {
      map[g.studentId] = map[g.studentId] || { total: 0, count: 0 };
      map[g.studentId].total += g.score;
      map[g.studentId].count += 1;
    });
    return map;
  }, [grades]);

  const getStudent = (id) => students.find((s) => s.id === id);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Nilai Siswa</h2>
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-gray-500">Tambahkan siswa terlebih dahulu.</p>
      ) : (
        <div className="mb-6">
          <h3 className="mb-2 font-medium">Tambah Nilai</h3>
          <GradeForm students={students} onSubmit={onCreate} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="mb-2 font-medium">Daftar Nilai</h3>
          {grades.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada nilai.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="px-3 py-2">Siswa</th>
                    <th className="px-3 py-2">Mapel</th>
                    <th className="px-3 py-2">Nilai</th>
                    <th className="px-3 py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => {
                    const s = getStudent(g.studentId);
                    return (
                      <tr key={g.id} className="border-b last:border-0">
                        <td className="px-3 py-2">{s ? `${s.name} (${s.classroom})` : '—'}</td>
                        <td className="px-3 py-2">{g.subject}</td>
                        <td className="px-3 py-2">{g.score}</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-2">
                            {editingId === g.id ? null : (
                              <>
                                <button onClick={() => setEditingId(g.id)} className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">Edit</button>
                                <button onClick={() => onDelete(g.id)} className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">Hapus</button>
                              </>
                            )}
                          </div>
                          {editingId === g.id && (
                            <div className="mt-3">
                              <GradeForm
                                students={students}
                                initial={g}
                                onSubmit={(data) => { onUpdate(g.id, data); setEditingId(null); }}
                                onCancel={() => setEditingId(null)}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 font-medium">Rata-Rata Per Siswa</h3>
          {students.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada siswa.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((s) => {
                const a = averages[s.id];
                const avg = a ? (a.total / a.count).toFixed(1) : '-';
                return (
                  <li key={s.id} className="flex items-center justify-between rounded-md border p-3">
                    <span>{s.name} ({s.classroom})</span>
                    <span className="font-semibold">{avg}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
