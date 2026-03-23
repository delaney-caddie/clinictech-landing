"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Invalid password");
        setPassword("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0F172A;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .login-card {
          background: #1E293B;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .login-logo {
          font-size: 20px;
          font-weight: 800;
          font-style: italic;
          color: #fff;
          text-align: center;
          margin-bottom: 8px;
        }
        .login-sub {
          text-align: center;
          color: #94A3B8;
          font-size: 14px;
          margin-bottom: 32px;
        }
        .login-input {
          width: 100%;
          padding: 14px 16px;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 10px;
          color: #fff;
          font-size: 15px;
          outline: none;
          margin-bottom: 16px;
          transition: border-color 0.2s;
        }
        .login-input:focus {
          border-color: #5EC4E3;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: #5EC4E3;
          color: #0F172A;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-btn:hover {
          background: #4AB8D9;
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-error {
          color: #F87171;
          font-size: 13px;
          text-align: center;
          margin-bottom: 16px;
        }
      `}</style>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">ClinicTech</div>
          <div className="login-sub">Admin Access</div>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              className="login-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Checking..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
