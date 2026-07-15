"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminBodyClass as bodyClass,
  glassCompactPanelClass,
  adminLabelClass as labelClass,
} from "@/components/ui/typography";
import type { Locale, PortfolioDictionary } from "@/lib/portfolio";
import AdminChatConversation from "./admin-chat-conversation";

type AdminCopy = PortfolioDictionary["adminWorkspace"];

type ChatSession = {
  id: string;
  threadId: string;
  locale: string;
  title: string | null;
  status: string;
  messageQty: number;
  updatedAt: string;
  createdAt: string;
};

type ApiResponse<T> = { ok: boolean; data: T };

export default function AdminChatTab({
  locale,
  copy,
}: {
  locale: Locale;
  copy?: AdminCopy;
}) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/chat/sessions?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Failed to load chat sessions");
      }
      const json: ApiResponse<{ sessions: ChatSession[]; total: number }> =
        await res.json();
      if (json.ok) {
        setSessions(json.data.sessions);
        setTotal(json.data.total);
        if (selectedId && !json.data.sessions.find((s) => s.id === selectedId)) {
          setSelectedId(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, selectedId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const selected = sessions.find((s) => s.id === selectedId) ?? null;

  function statusBadge(status: string) {
    switch (status) {
      case "pending_human":
        return "text-[#facc15] border-[#facc15]/40 bg-[#facc15]/10";
      case "human":
        return "text-[#6ff7a6] border-[#6ff7a6]/40 bg-[#6ff7a6]/10";
      default:
        return "text-[var(--color-soft)] border-[var(--color-line)] bg-transparent";
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <section className={glassCompactPanelClass}>
        <div className="border-b border-[var(--color-line)] p-4">
          <div className="flex items-center justify-between">
            <p className={labelClass}>{copy?.inquiriesLabel ?? "Conversations"}</p>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setSelectedId(null);
              }}
              className="max-w-28 truncate rounded border border-[var(--color-line)] bg-transparent px-2 py-1 font-mono text-[0.6rem] text-[var(--color-soft)] outline-none"
              aria-label={copy?.statusFilterLabel ?? "Filter status"}
            >
              <option value="">All</option>
              <option value="active">AI</option>
              <option value="pending_human">Pending</option>
              <option value="human">Human</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-[var(--color-line)]">
          {loading ? (
            <p className={`${bodyClass} p-4`}>{copy?.loadingLabel ?? "Loading..."}</p>
          ) : error ? (
            <p className={`${bodyClass} p-4 text-[#f87171]`}>{error}</p>
          ) : sessions.length === 0 ? (
            <p className={`${bodyClass} p-4`}>
              {copy?.emptyLabel ?? "No conversations yet."}
            </p>
          ) : (
            sessions.map((item) => {
              const isActive = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-[rgba(111,247,166,0.08)] border-l-2 border-[var(--color-accent)]"
                      : "hover:bg-[#090b0a] border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                      {item.title ?? "Untitled"}
                    </p>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.5rem] uppercase leading-none ${statusBadge(item.status)}`}
                    >
                      {item.status === "pending_human"
                        ? "!"
                        : item.status === "human"
                          ? "human"
                          : "ai"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                    {item.messageQty} messages
                  </p>
                  <p className="mt-0.5 font-mono text-[0.58rem] text-[var(--color-soft)]">
                    {new Date(item.updatedAt).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </button>
              );
            })
          )}
        </div>
        {total > sessions.length ? (
          <div className="border-t border-[var(--color-line)] p-3 text-center font-mono text-[0.6rem] text-[var(--color-soft)]">
            {total} total
          </div>
        ) : null}
      </section>

      <div className="min-w-0">
        {selected ? (
          <AdminChatConversation
            key={selected.id}
            locale={locale}
            sessionId={selected.id}
            sessionTitle={selected.title ?? "Untitled"}
            sessionStatus={selected.status}
            copy={copy}
            onStatusChange={fetchSessions}
          />
        ) : (
          <section className={glassCompactPanelClass}>
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-[#090b0a]">
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 11.5L2 14V4C2 3.44772 2.44772 3 3 3H13C13.5523 3 14 3.44772 14 4V10C14 10.5523 13.5523 11 13 11H7L4 11.5Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={`${bodyClass}`}>Select a conversation to view messages.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
