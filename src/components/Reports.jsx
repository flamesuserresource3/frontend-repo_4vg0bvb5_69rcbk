import React, { useMemo } from 'react';

const STATUS_LABEL = {
  hadir: 'Hadir',
  alfa: 'Alfa',
  izin: 'Izin',
  sakit: 'Sakit',
};

export default function Reports({ students, attendanceEntries, grades }) {
  const byDate = attendanceEntries;

  const summary = useMemo(() => {
    const sum = {};
    Object.values(byDate).forEach((day) => {
      Object.entries(day).forEach(([sid, st]) => {
        sum[sid] = sum[sid] || { hadir: 0, alfa: 0, izin: 0, sakit: 0 };
        sum[sid][st] += 1;
      });
    });
    return sum;
  }, [byDate]);

  const gradeAvg = useMemo(() => {
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
      <h2 className="mb-4 text-lg font-semibold">Rekapan</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="mb-2 font-medium">Rekap Absensi</h3>
          {students.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada siswa.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="px-3 py-2">Siswa</th>
                    <th className="px-3 py-2">Hadir</th>
                    <th className="px-3 py-2">Alfa</th>
                    <th className="px-3 py-2">Izin</th>
                    <th className="px-3 py-2">Sakit</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const rec = summary[s.id] || { hadir: 0, alfa: 0, izin: 0, sakit: 0 };
                    return (
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="px-3 py-2">{s.name} ({s.classroom})</td>
                        <td className="px-3 py-2">{rec.hadir}</td>
                        <td className="px-3 py-2">{rec.alfa}</td>
                        <td className="px-3 py-2">{rec.izin}</td>
                        <td className="px-3 py-2">{rec.sakit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 font-medium">Rata-Rata Nilai Per Siswa</h3>
          {students.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada siswa.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((s) => {
                const g = gradeAvg[s.id];
                const avg = g ? (g.total / g.count).toFixed(1) : '-';
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

      <div className="mt-6">
        <h3 className="mb-2 font-medium">Absensi Per Tanggal</h3>
        {Object.keys(byDate).length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada absensi.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(byDate).map(([date, rec]) => (
              <div key={date} className="rounded-lg border p-3">
                <div className="mb-2 text-sm font-medium text-gray-700">{date}</div>
                <div className="flex flex-wrap gap-2 text-sm">
                  {Object.entries(rec).map(([sid, st]) => {
                    const s = getStudent(sid);
                    return (
                      <span key={sid} className="rounded-md border bg-gray-50 px-2 py-1">
                        {s ? s.name : sid}: {STATUS_LABEL[st] || st}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
