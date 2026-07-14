"use client";

import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import {
  adminBodyClass as bodyClass,
  glassCompactPanelClass,
  adminLabelClass as labelClass,
  adminInputClass as sharedInputClass,
} from "@/components/ui/typography";
import type { Locale, PortfolioDictionary } from "@/lib/portfolio";

type AdminCopy = PortfolioDictionary["adminWorkspace"];

type InquiryItem = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  locale: string;
  deliveryMode: string;
  status: "new" | "in_progress" | "handled";
  internalNote: string | null;
  handledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type SummaryResponse = {
  provider: string;
  mode: string;
  summary: string;
  prompt: string;
};

type InquiryActivityItem = {
  id: string;
  actorType: string;
  actorLabel: string;
  eventType: string;
  statusFrom: string | null;
  statusTo: string | null;
  internalNoteFrom: string | null;
  internalNoteTo: string | null;
  createdAt: string;
};

type InquiryListResponse = {
  items: InquiryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type InquiryDetailResponse = InquiryItem & {
  activities: InquiryActivityItem[];
};

type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor" | "viewer";
};

type SessionItem = {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

type UserItem = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor" | "viewer";
};

const defaultPageSize = 20;

function redirectToAdminLogin(locale: Locale) {
  window.location.assign(`/${locale}/admin/login`);
}

export default function AdminContactInquiries({
  locale,
  copy,
}: {
  locale: Locale;
  copy: AdminCopy;
}) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [draftStatus, setDraftStatus] = useState<InquiryItem["status"]>("new");
  const [draftInternalNote, setDraftInternalNote] = useState("");
  const [selectedInquiryDetail, setSelectedInquiryDetail] =
    useState<InquiryDetailResponse | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryItem["status"] | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingList, startLoadingList] = useTransition();
  const [isLoadingSummary, startLoadingSummary] = useTransition();
  const [isSavingChanges, startSavingChanges] = useTransition();
  const [isSigningOut, startSigningOut] = useTransition();
  const [isLoadingDetail, startLoadingDetail] = useTransition();
  const [isLoadingSessions, startLoadingSessions] = useTransition();
  const [isRevokingEverywhere, startRevokingEverywhere] = useTransition();
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [isLoadingUsers, startLoadingUsers] = useTransition();
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const deferredSearchInput = useDeferredValue(searchInput);

  const fetchInquiries = useEffectEvent(
    (options: { page: number; status: InquiryItem["status"] | "all"; query: string }) => {
      setSummary(null);

      startLoadingList(async () => {
        try {
          setSelectedInquiryDetail(null);
          const searchParams = new URLSearchParams({
            limit: String(defaultPageSize),
            page: String(options.page),
            status: options.status,
          });

          if (options.query) {
            searchParams.set("query", options.query);
          }

          const response = await fetch(
            `/api/admin/contact-inquiries?${searchParams.toString()}`,
            {
              cache: "no-store",
            },
          );

          const payload = (await response.json()) as
            | {
                ok: true;
                data: InquiryListResponse;
              }
            | {
                ok: false;
                error: {
                  message: string;
                };
              };

          if (!response.ok || !payload.ok) {
            const message =
              !payload.ok && response.status === 401
                ? copy.authRequiredMessage
                : !payload.ok && response.status === 403
                  ? copy.authInvalidMessage
                  : !payload.ok
                    ? payload.error.message
                    : copy.requestFailedLabel;

            setStatusMessage(message);

            if (response.status === 401 || response.status === 403) {
              redirectToAdminLogin(locale);
            }

            return;
          }

          const { items, total, page, totalPages: nextTotalPages } = payload.data;
          setInquiries(items);
          setTotalResults(total);
          setCurrentPage(page);
          setTotalPages(nextTotalPages);
          setSelectedInquiryId((current) =>
            items.some((item) => item.id === current) ? current : (items[0]?.id ?? null),
          );
          setStatusMessage(null);
        } catch {
          setStatusMessage(copy.requestFailedLabel);
        }
      });
    },
  );

  useEffect(() => {
    fetchInquiries({
      page: currentPage,
      status: statusFilter,
      query: deferredSearchInput.trim(),
    });
  }, [currentPage, deferredSearchInput, statusFilter]);

  const selectedInquiry = useMemo(
    () => inquiries.find((item) => item.id === selectedInquiryId) ?? null,
    [inquiries, selectedInquiryId],
  );

  const fetchInquiryDetail = useEffectEvent((id: string) => {
    startLoadingDetail(async () => {
      try {
        const response = await fetch(`/api/admin/contact-inquiries/${id}`, {
          cache: "no-store",
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: InquiryDetailResponse;
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
          }
          return;
        }

        setSelectedInquiryDetail(payload.data);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  });

  useEffect(() => {
    if (!selectedInquiryId) {
      setSelectedInquiryDetail(null);
      return;
    }

    fetchInquiryDetail(selectedInquiryId);
  }, [selectedInquiryId]);

  useEffect(() => {
    const inquiry = selectedInquiryDetail ?? selectedInquiry;

    if (!inquiry) {
      setDraftStatus("new");
      setDraftInternalNote("");
      return;
    }

    setDraftStatus(inquiry.status);
    setDraftInternalNote(inquiry.internalNote ?? "");
  }, [selectedInquiry, selectedInquiryDetail]);

  const statusLabelByValue: Record<InquiryItem["status"], string> = {
    new: copy.statusNewLabel,
    in_progress: copy.statusInProgressLabel,
    handled: copy.statusHandledLabel,
  };

  const roleLabelByValue: Record<CurrentUser["role"], string> = {
    admin: copy.roleAdminLabel,
    editor: copy.roleEditorLabel,
    viewer: copy.roleViewerLabel,
  };

  const canEditInquiries =
    currentUser?.role === "admin" || currentUser?.role === "editor";
  const canManageUsers = currentUser?.role === "admin";

  const fetchCurrentUser = useEffectEvent(() => {
    void (async () => {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: {
                user: CurrentUser | null;
              };
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
          }
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          return;
        }

        setCurrentUser(payload.data.user);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    })();
  });

  const fetchSessions = useEffectEvent(() => {
    startLoadingSessions(async () => {
      try {
        const response = await fetch("/api/admin/sessions", {
          cache: "no-store",
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: {
                items: SessionItem[];
              };
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
          }
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          return;
        }

        setSessions(payload.data.items);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  });

  const fetchUsers = useEffectEvent(() => {
    startLoadingUsers(async () => {
      try {
        const response = await fetch("/api/admin/users", {
          cache: "no-store",
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: {
                items: UserItem[];
              };
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
          }
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          return;
        }

        setUsers(payload.data.items);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [currentUser?.role]);

  function revokeSession(sessionId: string) {
    setRevokingSessionId(sessionId);

    void (async () => {
      try {
        const response = await fetch(`/api/admin/sessions/${sessionId}`, {
          method: "DELETE",
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: {
                revoked: boolean;
                isCurrent: boolean;
              };
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
          }
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          return;
        }

        if (payload.data.isCurrent) {
          redirectToAdminLogin(locale);
          return;
        }

        setSessions((current) => current.filter((session) => session.id !== sessionId));
        setStatusMessage(copy.sessionsUpdatedMessage);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      } finally {
        setRevokingSessionId(null);
      }
    })();
  }

  function logoutEverywhere() {
    startRevokingEverywhere(async () => {
      try {
        const response = await fetch("/api/admin/sessions", {
          method: "DELETE",
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: {
                authenticated: boolean;
              };
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          return;
        }

        redirectToAdminLogin(locale);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  }

  function saveUserRole(userId: string, role: UserItem["role"]) {
    setSavingUserId(userId);

    void (async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            role,
          }),
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: UserItem;
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          return;
        }

        setUsers((current) =>
          current.map((item) => (item.id === payload.data.id ? payload.data : item)),
        );

        if (currentUser?.id === payload.data.id) {
          setCurrentUser(payload.data);
        }

        setStatusMessage(copy.roleUpdatedMessage);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      } finally {
        setSavingUserId(null);
      }
    })();
  }

  function signOut() {
    startSigningOut(async () => {
      try {
        await fetch("/api/admin/session", {
          method: "DELETE",
        });
      } finally {
        redirectToAdminLogin(locale);
      }
    });
  }

  function fetchSummary() {
    if (!selectedInquiry) {
      setStatusMessage(copy.authRequiredMessage);
      return;
    }

    startLoadingSummary(async () => {
      try {
        const response = await fetch("/api/ai/contact-summary", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            inquiryId: selectedInquiry.id,
          }),
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: SummaryResponse;
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
          }
          return;
        }

        setSummary(payload.data);
        setStatusMessage(null);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  }

  function saveInquiryChanges() {
    if (!selectedInquiry) {
      setStatusMessage(copy.authRequiredMessage);
      return;
    }

    startSavingChanges(async () => {
      try {
        const response = await fetch(
          `/api/admin/contact-inquiries/${selectedInquiry.id}`,
          {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              status: draftStatus,
              internalNote: draftInternalNote,
            }),
          },
        );

        const payload = (await response.json()) as
          | {
              ok: true;
              data: InquiryItem;
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          setStatusMessage(!payload.ok ? payload.error.message : copy.requestFailedLabel);
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
          }
          return;
        }

        setInquiries((current) =>
          current.map((item) => (item.id === payload.data.id ? payload.data : item)),
        );
        setSelectedInquiryDetail((current) =>
          current?.id === payload.data.id
            ? { ...current, ...payload.data, activities: current.activities }
            : current,
        );
        setStatusMessage(copy.savedChangesMessage);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  }

  const fieldClass = `mt-2 ${sharedInputClass}`;
  const detailInquiry = selectedInquiryDetail ?? selectedInquiry;

  function formatActivityEvent(eventType: string) {
    switch (eventType) {
      case "created":
        return copy.historyCreatedLabel;
      case "status_updated":
        return copy.historyStatusUpdatedLabel;
      case "note_updated":
        return copy.historyNoteUpdatedLabel;
      case "status_and_note_updated":
        return copy.historyStatusAndNoteUpdatedLabel;
      default:
        return eventType;
    }
  }

  return (
    <div lang={locale}>
      <div className="grid gap-5 xl:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="rounded-[0.375rem] border border-[var(--color-line)] bg-[#0d0f0e] p-4">
            <p className={labelClass}>{copy.currentUserLabel}</p>
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                {currentUser?.email ?? "-"}
              </p>
              <p className={bodyClass}>
                {copy.roleLabel}: {currentUser ? roleLabelByValue[currentUser.role] : "-"}
              </p>
              <p className={bodyClass}>
                {canManageUsers
                  ? copy.permissionsManageUsersLabel
                  : canEditInquiries
                    ? copy.permissionsWriteLabel
                    : copy.permissionsReadOnlyLabel}
              </p>
              <Button
                variant="ghost"
                size="xs"
                onClick={signOut}
                disabled={isSigningOut}
                className="mt-3"
              >
                {isSigningOut ? copy.signingOutLabel : copy.signOutLabel}
              </Button>
            </div>
          </section>

          <section className="rounded-[0.375rem] border border-[var(--color-line)] bg-[#0d0f0e] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className={labelClass}>{copy.sessionsLabel}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={logoutEverywhere}
                disabled={isRevokingEverywhere}
              >
                {isRevokingEverywhere
                  ? copy.loggingOutEverywhereLabel
                  : copy.logoutEverywhereLabel}
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {sessions.length === 0 ? (
                <p className={bodyClass}>
                  {isLoadingSessions ? copy.loadingLabel : copy.sessionsEmptyLabel}
                </p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                        {session.isCurrent ? copy.sessionsCurrentLabel : session.id}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => revokeSession(session.id)}
                        disabled={revokingSessionId === session.id}
                      >
                        {revokingSessionId === session.id
                          ? copy.revokingSessionLabel
                          : copy.revokeSessionLabel}
                      </Button>
                    </div>
                    <p className={`${bodyClass} mt-2`}>
                      Created: {new Date(session.createdAt).toLocaleString(locale)}
                    </p>
                    <p className={bodyClass}>
                      Last seen: {new Date(session.lastSeenAt).toLocaleString(locale)}
                    </p>
                    <p className={bodyClass}>
                      Expires: {new Date(session.expiresAt).toLocaleString(locale)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {canManageUsers ? (
            <section className="rounded-[0.375rem] border border-[var(--color-line)] bg-[#0d0f0e] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className={labelClass}>{copy.usersLabel}</p>
                {isLoadingUsers ? (
                  <span className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                    {copy.loadingLabel}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 space-y-3">
                {users.length === 0 ? (
                  <p className={bodyClass}>{copy.usersEmptyLabel}</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4"
                    >
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        {user.email}
                      </p>
                      <p className={`${bodyClass} mt-1`}>{user.name ?? "-"}</p>
                      <label
                        htmlFor={`user-role-${user.id}`}
                        className={`${labelClass} mt-3 block`}
                      >
                        {copy.roleLabel}
                      </label>
                      <select
                        id={`user-role-${user.id}`}
                        value={user.role}
                        onChange={(event) =>
                          saveUserRole(user.id, event.target.value as UserItem["role"])
                        }
                        disabled={savingUserId === user.id}
                        className={fieldClass}
                      >
                        <option value="admin">{copy.roleAdminLabel}</option>
                        <option value="editor">{copy.roleEditorLabel}</option>
                        <option value="viewer">{copy.roleViewerLabel}</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </section>
          ) : null}

          <section className="rounded-[0.375rem] border border-[var(--color-line)] bg-[#0d0f0e] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className={labelClass}>{copy.inquiriesLabel}</p>
              <span className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                {totalResults} {copy.resultsLabel}
              </span>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
                <p className={labelClass}>{copy.listControlsLabel}</p>
                <div className="mt-3 grid gap-4">
                  <div>
                    <label htmlFor="admin-search" className={labelClass}>
                      {copy.searchLabel}
                    </label>
                    <input
                      id="admin-search"
                      value={searchInput}
                      onChange={(event) => {
                        setSearchInput(event.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder={copy.searchPlaceholder}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="admin-status-filter" className={labelClass}>
                      {copy.statusFilterLabel}
                    </label>
                    <select
                      id="admin-status-filter"
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(
                          event.target.value as InquiryItem["status"] | "all",
                        );
                        setCurrentPage(1);
                      }}
                      className={fieldClass}
                    >
                      <option value="all">{copy.statusAllLabel}</option>
                      <option value="new">{copy.statusNewLabel}</option>
                      <option value="in_progress">{copy.statusInProgressLabel}</option>
                      <option value="handled">{copy.statusHandledLabel}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {inquiries.length === 0 ? (
                <p className={bodyClass}>{copy.emptyLabel}</p>
              ) : (
                inquiries.map((item) => {
                  const isActive = item.id === selectedInquiryId;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedInquiryId(item.id);
                        setSummary(null);
                        setSelectedInquiryDetail(null);
                      }}
                      className={`w-full rounded-[0.25rem] border px-4 py-3 text-left transition-colors ${
                        isActive
                          ? "border-[var(--color-accent)] bg-[var(--accent-dim)]"
                          : "border-[var(--color-line)] bg-[#090b0a] hover:border-[var(--color-line-strong)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          {item.subject}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-[var(--color-line)] px-2 py-1 font-mono text-[0.58rem] uppercase text-[var(--color-soft)]">
                            {statusLabelByValue[item.status]}
                          </span>
                          <span className="font-mono text-[0.64rem] uppercase text-[var(--color-soft)]">
                            {item.locale}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {item.email}
                      </p>
                      <p className="mt-2 font-mono text-[0.64rem] uppercase text-[var(--color-soft)]">
                        {new Date(item.createdAt).toLocaleString(locale)}
                      </p>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
              <p className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                {copy.pageLabel} {currentPage} / {totalPages}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage <= 1 || isLoadingList}
                >
                  {copy.previousPageLabel}
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage >= totalPages || isLoadingList}
                >
                  {copy.nextPageLabel}
                </Button>
              </div>
            </div>
          </section>
        </aside>

        <div className="min-w-0 space-y-5">
          {statusMessage ? (
            <section className={`${glassCompactPanelClass} p-5 sm:p-6`}>
              <p
                role="status"
                className="border-l-2 border-[var(--color-accent)] bg-[var(--accent-dim)] px-3 py-2 text-sm text-[var(--color-text)]"
              >
                {statusMessage}
              </p>
            </section>
          ) : null}

          <section className={`${glassCompactPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
              <p className={labelClass}>{copy.detailsLabel}</p>
              {detailInquiry ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={fetchSummary}
                  disabled={isLoadingSummary}
                >
                  {isLoadingSummary
                    ? copy.generatingSummaryLabel
                    : copy.generateSummaryLabel}
                </Button>
              ) : null}
            </div>

            {detailInquiry ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      [copy.nameLabel, detailInquiry.name],
                      [copy.emailLabel, detailInquiry.email],
                      [copy.companyLabel, detailInquiry.company ?? "-"],
                      [copy.subjectLabel, detailInquiry.subject],
                      [copy.localeLabel, detailInquiry.locale],
                      [copy.deliveryLabel, detailInquiry.deliveryMode],
                      [copy.statusLabel, statusLabelByValue[detailInquiry.status]],
                    ].map(([label, value]) => (
                      <div
                        key={`${label}-${value}`}
                        className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4"
                      >
                        <p className={labelClass}>{label}</p>
                        <p className="mt-2 text-sm text-[var(--color-text)]">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
                    <p className={labelClass}>{copy.messageLabel}</p>
                    <p className={`${bodyClass} mt-3 whitespace-pre-wrap`}>
                      {detailInquiry.message}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
                    <p className={labelClass}>{copy.createdAtLabel}</p>
                    <p className="mt-2 text-sm text-[var(--color-text)]">
                      {new Date(detailInquiry.createdAt).toLocaleString(locale)}
                    </p>
                  </div>

                  <div className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
                    <p className={labelClass}>{copy.handledAtLabel}</p>
                    <p className="mt-2 text-sm text-[var(--color-text)]">
                      {detailInquiry.handledAt
                        ? new Date(detailInquiry.handledAt).toLocaleString(locale)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className={`${bodyClass} mt-4`}>{copy.emptyLabel}</p>
            )}
          </section>

          <section className={`${glassCompactPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
              <p className={labelClass}>{copy.workflowLabel}</p>
              {detailInquiry && canEditInquiries ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={saveInquiryChanges}
                  disabled={isSavingChanges}
                >
                  {isSavingChanges ? copy.savingChangesLabel : copy.saveChangesLabel}
                </Button>
              ) : null}
            </div>

            {detailInquiry ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <div className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
                  <label htmlFor="inquiry-status" className={labelClass}>
                    {copy.statusLabel}
                  </label>
                  <select
                    id="inquiry-status"
                    value={draftStatus}
                    onChange={(event) =>
                      setDraftStatus(event.target.value as InquiryItem["status"])
                    }
                    disabled={!canEditInquiries}
                    className={fieldClass}
                  >
                    <option value="new">{copy.statusNewLabel}</option>
                    <option value="in_progress">{copy.statusInProgressLabel}</option>
                    <option value="handled">{copy.statusHandledLabel}</option>
                  </select>
                </div>

                <div className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
                  <label htmlFor="inquiry-note" className={labelClass}>
                    {copy.internalNoteLabel}
                  </label>
                  <textarea
                    id="inquiry-note"
                    value={draftInternalNote}
                    onChange={(event) => setDraftInternalNote(event.target.value)}
                    placeholder={copy.internalNotePlaceholder}
                    rows={7}
                    disabled={!canEditInquiries}
                    className={`${fieldClass} min-h-32 resize-y`}
                  />
                </div>
              </div>
            ) : (
              <p className={`${bodyClass} mt-4`}>{copy.emptyLabel}</p>
            )}
            {!canEditInquiries ? (
              <p className={`${bodyClass} mt-4`}>{copy.permissionsReadOnlyLabel}</p>
            ) : null}
          </section>

          <section className={`${glassCompactPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
              <p className={labelClass}>{copy.historyLabel}</p>
              {isLoadingDetail ? (
                <span className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                  {copy.loadingLabel}
                </span>
              ) : null}
            </div>

            {selectedInquiryDetail?.activities.length ? (
              <div className="mt-4 space-y-4">
                {selectedInquiryDetail.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        {formatActivityEvent(activity.eventType)}
                      </p>
                      <span className="font-mono text-[0.64rem] uppercase text-[var(--color-soft)]">
                        {new Date(activity.createdAt).toLocaleString(locale)}
                      </span>
                    </div>

                    <p className={`${bodyClass} mt-2`}>
                      {copy.historyByLabel}: {activity.actorLabel}
                    </p>

                    {activity.statusFrom || activity.statusTo ? (
                      <p className={`${bodyClass} mt-2`}>
                        {copy.historyFromLabel}:{" "}
                        {activity.statusFrom
                          ? statusLabelByValue[
                              activity.statusFrom as InquiryItem["status"]
                            ]
                          : "-"}{" "}
                        {copy.historyToLabel}:{" "}
                        {activity.statusTo
                          ? statusLabelByValue[activity.statusTo as InquiryItem["status"]]
                          : "-"}
                      </p>
                    ) : null}

                    {activity.internalNoteFrom !== null ||
                    activity.internalNoteTo !== null ? (
                      <div className="mt-3 space-y-2">
                        <p className={labelClass}>{copy.historyNoteBeforeLabel}</p>
                        <p className={`${bodyClass} whitespace-pre-wrap`}>
                          {activity.internalNoteFrom || "-"}
                        </p>
                        <p className={labelClass}>{copy.historyNoteAfterLabel}</p>
                        <p className={`${bodyClass} whitespace-pre-wrap`}>
                          {activity.internalNoteTo || "-"}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className={`${bodyClass} mt-4`}>{copy.historyEmptyLabel}</p>
            )}
          </section>

          <section className={`${glassCompactPanelClass} p-5 sm:p-6`}>
            <p className={labelClass}>{copy.summaryLabel}</p>
            {summary ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
                  <p className={labelClass}>{copy.summaryResultLabel}</p>
                  <p className={`${bodyClass} mt-3 whitespace-pre-wrap`}>
                    {summary.summary}
                  </p>
                </div>
                <div className="rounded-[0.25rem] border border-[var(--color-line)] bg-[#090b0a] p-4">
                  <p className={labelClass}>{copy.summaryPromptLabel}</p>
                  <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-words font-mono text-[0.72rem] leading-6 text-[var(--color-soft)]">
                    {summary.prompt}
                  </pre>
                </div>
              </div>
            ) : (
              <p className={`${bodyClass} mt-4`}>{copy.summaryEmptyLabel}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
