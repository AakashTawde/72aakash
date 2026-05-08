import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-900">VoIP CRM</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.name}{" "}
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {user?.role}
              </span>
            </span>
            <button
              onClick={logout}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Welcome, {user?.name}!
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Phase 1 (auth + roles) is live. Coming next:
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-6 text-sm text-slate-700">
            <li>Phase 2 — Lead management (CRUD, assign, notes)</li>
            <li>Phase 3 — Calling MVP (Exotel click-to-call + inbound ring)</li>
            <li>Phase 4 — Call logs + recordings</li>
            <li>Phase 5 — Reminders & follow-ups</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
