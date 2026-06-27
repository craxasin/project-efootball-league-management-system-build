"use client";

import { useState } from "react";

interface PasswordResetModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function PasswordResetModal({ userId, userName, onClose, onSuccess }: PasswordResetModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function validate() {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to reset password");
      }

      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-black text-slate-950">Reset password for {userName}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
              disabled={loading}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
              disabled={loading}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {apiError && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{apiError}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
