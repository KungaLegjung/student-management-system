"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import type { CSSProperties } from "react";

type Teacher = {
  id: number;
  name: string;
  email: string;
};

type Student = {
  id: number;
  name: string;
  email: string;
  course: string;
  created_at?: string;
  updated_at?: string;
};

export default function TeacherStudentsPage() {
  const router = useRouter();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");

    if (!storedTeacher) {
      router.push("/teacher/login");
      return;
    }

    setTeacher(JSON.parse(storedTeacher) as Teacher);
    fetchStudents();
  }, [router]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get<Student[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/students`
      );

      setStudents(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    router.push("/teacher/login");
  };

  if (!teacher) {
    return <p style={{ padding: "30px" }}>Loading...</p>;
  }

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <h2>Manage Students</h2>

        <div>
          <span>Welcome, {teacher.name}</span>
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>
      </nav>

      <main style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1>Students</h1>
            <p>View all students from Laravel API.</p>
          </div>

          <div style={styles.actions}>
  <Link href="/teacher/students/create" style={styles.addButton}>
    Add Student
  </Link>

  <Link href="/teacher/dashboard" style={styles.backButton}>
    Back to Dashboard
  </Link>
</div>
        </div>

        {loading && <p>Loading students...</p>}

        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Course</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={4}>
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td style={styles.td}>{student.id}</td>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={styles.td}>{student.course}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  navbar: {
    backgroundColor: "#1e293b", // Deep slate for a premium feel
    color: "#ffffff",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
  },
  addButton: {
    backgroundColor: "#16a34a",
    color: "white",
    textDecoration: "none",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  logout: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  container: {
    padding: "2rem",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  backButton: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    textDecoration: "none",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  table: {
    width: "100%",
    backgroundColor: "white",
    borderCollapse: "separate", // Allows for better corner rounding
    borderSpacing: 0,
    borderRadius: "8px",
    overflow: "hidden", // Ensures the corners of the table stay rounded
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  th: {
    backgroundColor: "#f8fafc",
    padding: "1rem",
    textAlign: "left",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "1rem",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "0.95rem",
    color: "#334155",
  },
  error: {
    color: "#dc2626",
    padding: "1rem",
    backgroundColor: "#fef2f2",
    borderRadius: "6px",
    marginBottom: "1rem",
  },
};