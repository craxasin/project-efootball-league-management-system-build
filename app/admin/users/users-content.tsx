"use client";

import { useCallback, useState } from "react";
import { PasswordResetModal } from "@/components/reset-password-modal";
import { Badge } from "@/components/ui";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "PLAYER";
  createdAt: Date;
}

interface UserControlContentProps {
  users: User[];
}

export function UserControlContent({ users }: UserControlContentProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleCloseModal = useCallback(() => {
    setSelectedUserId(null);
  }, []);

  const handleSuccess = useCallback(() => {
    setSuccessMessage("Password reset successfully.");
    setTimeout(() => setSuccessMessage(""), 3000);
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-black text-slate-950">User Control</h1>
        <p className="mt-2 text-slate-600">Manage user accounts and reset passwords</p>
      </div>

      {successMessage && (
        <div className="rounded bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="overflow-x-auto rounded border border-slate-200 bg-white shadow-panel">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Username</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-950">{user.name || "—"}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <Badge tone={user.role === "ADMIN" ? "green" : "neutral"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedUserId(user.id)}
                    className="rounded bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="rounded border border-slate-100 bg-slate-50 px-6 py-12 text-center">
          <p className="font-semibold text-slate-600">No users found</p>
        </div>
      )}

      {selectedUser && (
        <PasswordResetModal
          userId={selectedUser.id}
          userName={selectedUser.name || selectedUser.email}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
