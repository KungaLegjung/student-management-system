"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Teacher = {
  id: number;
  name: string;
  email: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  teacher: Teacher;
};

export default function TeacherLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("teacher@gmail.com");
  const [password, setPassword] = useState<string>("12345678");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/login`,
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem(
          "teacher",
          JSON.stringify(response.data.teacher)
        );

        router.push("/teacher/dashboard");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Teacher Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={styles.group}>
            <label>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div style={styles.group}>
            <label>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#0f172a", // Dark navy/slate instead of pure black
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    color: "#ffffff",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "-0.025em",
  },
  group: {
    marginBottom: "1.25rem",
  },
  input: {
    width: "100%",
    boxSizing: "border-box", // Essential for full-width padding
    padding: "0.75rem 1rem",
    marginTop: "0.5rem",
    backgroundColor: "#1e293b", // Slightly lighter than the card background
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "white",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
    marginTop: "1rem",
    transition: "background 0.2s ease",
  },
  error: {
    color: "#f87171", // Lighter red for readability on dark backgrounds
    textAlign: "center",
    fontSize: "0.875rem",
    marginTop: "1rem",
  },
};