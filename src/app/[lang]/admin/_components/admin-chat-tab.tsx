"use client";

import { useState } from "react";
import {
  adminBodyClass as bodyClass,
  glassCompactPanelClass,
  adminLabelClass as labelClass,
} from "@/components/ui/typography";
import type { Locale, PortfolioDictionary } from "@/lib/portfolio";
import AdminChatConversation from "./admin-chat-conversation";

type AdminCopy = PortfolioDictionary["adminWorkspace"];

const mockInquiries = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@example.com",
    subject: "Project inquiry — AI integration",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@acme.com",
    subject: "Frontend collaboration opportunity",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Alice Wong",
    email: "alice@startup.io",
    subject: "Consulting for web platform redesign",
    createdAt: new Date().toISOString(),
  },
];

export default function AdminChatTab({ locale }: { locale: Locale; copy?: AdminCopy }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockInquiries.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <section className={glassCompactPanelClass}>
        <div className="border-b border-[var(--color-line)] p-4">
          <p className={labelClass}>Inbox</p>
        </div>
        <div className="divide-y divide-[var(--color-line)]">
          {mockInquiries.length === 0 ? (
            <p className={`${bodyClass} p-4`}>No conversations yet.</p>
          ) : (
            mockInquiries.map((item) => {
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
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                    {item.subject}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)]">{item.name}</p>
                  <p className="mt-0.5 font-mono text-[0.58rem] text-[var(--color-soft)]">
                    {item.email}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </section>

      <div className="min-w-0">
        {selected ? (
          <AdminChatConversation
            locale={locale}
            inquirySubject={selected.subject}
            contactEmail={selected.email}
            contactName={selected.name}
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
