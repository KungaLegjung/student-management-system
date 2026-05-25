"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import Link from "next/link";

type Teacher = {
  id: number;
  name: string;
  email: string;
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");

    if (!storedTeacher) {
      router.push("/teacher/login");
      return;
    }

    setTeacher(JSON.parse(storedTeacher) as Teacher);
  }, [router]);

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
        <h2>Teacher Dashboard</h2>

        <div>
          <span>Welcome, {teacher.name}</span>
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>
      </nav>

      <main style={styles.container}>
        <h1>Dashboard</h1>
        <p>You are logged in as a teacher.</p>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Students</h3>
            <p>Manage students</p>
          </div>

          <Link href="/teacher/students" style={styles.cardLink}>
  <div style={styles.card}>
    <h3>Students</h3>
    <p>Manage students</p>
  </div>
</Link>

          <div style={styles.card}>
            <h3>Attendance</h3>
            <p>Manage attendance</p>
          </div>
        </div>
      </main>
    </div>
  );
}
const styles: { [key: string]: CSSProperties } = {
    page: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc", // Softer background than #f4f6f8
      fontFamily: "'Inter', -apple-system, sans-serif", // Modern web font stack
      color: "#1e293b",
    },
    navbar: {
      backgroundColor: "#1e293b", // Slate 800 for a professional look
      color: "#ffffff",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    logout: {
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontWeight: 600,
      transition: "background 0.2s ease",
    },
    container: {
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    cards: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "1.5rem",
      marginTop: "1.5rem",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      textAlign: "center",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
      border: "1px solid #e2e8f0",
    },
    cardLink: {
      textDecoration: "none",
      color: "inherit",
      display: "block",
    }
  };