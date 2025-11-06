import React, { useMemo, useState } from 'react';
import Students from './components/Students.jsx';
import Attendance from './components/Attendance.jsx';
import Agenda from './components/Agenda.jsx';
import Grades from './components/Grades.jsx';

function Header({ active, onChange }) {
  const tabs = [
    { key: 'students', label: 'Siswa' },
    { key: 'attendance', label: 'Absensi' },
    { key: 'agenda', label: 'Agenda' },
    { key: 'grades', label: 'Nilai' },
  ];
  return (
    <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-4">
          <div className="text-xl font-bold text-blue-700">Absensi SD</div>
          <nav className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  active === t.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState('students');

  // Data Siswa
  const [students, setStudents] = useState([
    { id: 's1', name: 'Budi', classroom: '5A' },
    { id: 's2', name: 'Siti', classroom: '5A' },
  ]);

  // Absensi: { 'YYYY-MM-DD': { [studentId]: 'hadir'|'alfa'|'izin'|'sakit' } }
  const [attendance, setAttendance] = useState({});

  // Agenda
  const [events, setEvents] = useState([]);

  // Nilai
  const [grades, setGrades] = useState([]);

  const addStudent = (data) => {
    const id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setStudents((prev) => [...prev, { id, ...data }]);
  };
  const updateStudent = (id, data) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };
  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Hapus nilai milik siswa
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
    // Hapus rekam absensi milik siswa
    setAttendance((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((date) => {
        if (copy[date] && copy[date][id]) {
          const { [id]: _, ...rest } = copy[date];
          copy[date] = rest;
        }
      });
      return copy;
    });
  };

  const markAttendance = (date, studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: { ...(prev[date] || {}), [studentId]: status },
    }));
  };

  const createEvent = (data) => {
    const id = `e_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setEvents((prev) => [...prev, { id, ...data }]);
  };
  const updateEvent = (id, data) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  };
  const deleteEvent = (id) => setEvents((prev) => prev.filter((e) => e.id !== id));

  const createGrade = (data) => {
    const id = `g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setGrades((prev) => [...prev, { id, ...data }]);
  };
  const updateGrade = (id, data) => {
    setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
  };
  const deleteGrade = (id) => setGrades((prev) => prev.filter((g) => g.id !== id));

  const totalAttendanceToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const rec = attendance[today] || {};
    const counts = { hadir: 0, alfa: 0, izin: 0, sakit: 0 };
    Object.values(rec).forEach((st) => {
      counts[st] += 1;
    });
    return counts;
  }, [attendance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header active={active} onChange={setActive} />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">Jumlah Siswa</div>
            <div className="text-2xl font-bold">{students.length}</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">Hadir (hari ini)</div>
            <div className="text-2xl font-bold text-green-600">{totalAttendanceToday.hadir}</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">Izin/Sakit (hari ini)</div>
            <div className="text-2xl font-bold text-blue-600">{totalAttendanceToday.izin + totalAttendanceToday.sakit}</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">Alfa (hari ini)</div>
            <div className="text-2xl font-bold text-red-600">{totalAttendanceToday.alfa}</div>
          </div>
        </div>

        {active === 'students' && (
          <Students
            students={students}
            onCreate={addStudent}
            onUpdate={updateStudent}
            onDelete={deleteStudent}
          />
        )}

        {active === 'attendance' && (
          <Attendance
            students={students}
            entries={attendance}
            onMark={markAttendance}
          />
        )}

        {active === 'agenda' && (
          <Agenda
            events={events}
            onCreate={createEvent}
            onUpdate={updateEvent}
            onDelete={deleteEvent}
          />
        )}

        {active === 'grades' && (
          <Grades
            students={students}
            grades={grades}
            onCreate={createGrade}
            onUpdate={updateGrade}
            onDelete={deleteGrade}
          />
        )}
      </div>
    </div>
  );
}
