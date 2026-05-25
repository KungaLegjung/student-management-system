"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import type { CSSProperties } from "react";

type Teacher = {
  id: number;
  name: string;
  email: string;
};

type StudentResponse = {
  id: number;
  name: string;
  email: string;
  course: string;
};

export default function CreateStudentPage() {
  const router = useRouter();

  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [course, setCourse] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");

    if (!storedTeacher) {
      router.push("/teacher/login");
      return;
    }

    setTeacher(JSON.parse(storedTeacher) as Teacher);
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await axios.post<StudentResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/students`,
        {
          name,
          email,
          course,
        }
      );

      router.push("/teacher/students");
    } catch (err: any) {
      console.log("ADD STUDENT ERROR:", err.response?.data || err.message);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add student");
      }
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
        <h2>Add Student</h2>

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
            <h1>Create Student</h1>
            <p>Add a new student to the system.</p>
          </div>

          <Link href="/teacher/students" style={styles.backButton}>
            Back to Students
          </Link>
        </div>

        <div style={styles.card}>
          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={styles.group}>
              <label>Name</label>
              <input
                style={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
                required
              />
            </div>

            <div style={styles.group}>
              <label>Email</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter student email"
                required
              />
            </div>

            <div style={styles.group}>
              <label>Course</label>
              <input
                style={styles.input}
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Enter course"
                required
              />
            </div>

            <button style={styles.submitButton} type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Student"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#334155",
  },
  navbar: {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
  },
  logout: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  },
  container: {
    padding: "2rem",
    maxWidth: "500px", // Form-centric layout
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  backButton: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  group: {
    marginBottom: "1.25rem",
  },
  input: {
    width: "100%",
    boxSizing: "border-box", // Critical for padding/width consistency
    padding: "0.75rem",
    marginTop: "0.5rem",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  submitButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
    marginTop: "1rem",
  },
  error: {
    color: "#dc2626",
    backgroundColor: "#fef2f2",
    padding: "0.75rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.875rem",
  },
};