"use client";

import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  useTransition,
} from "react";

import type { adminDirectoryCopy } from "../_data/admin";
import type { Locale } from "../_data/portfolio";

type AdminCopy = (typeof adminDirectoryCopy)[Locale];

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

        fetchSessions();
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
        if (selectedInquiryDetail?.id === payload.data.id) {
          fetchInquiryDetail(payload.data.id);
        }
        setStatusMessage(copy.savedChangesMessage);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  }

  const pageShellClass =
    "min-h-screen bg-[var(--color-bg)] px-5 py-8 text-[var(--color-text)] sm:px-8 sm:py-10";
  const panelClass =
    "rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-5 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-6";
  const titleClass =
    '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance';
  const bodyClass =
    "text-[0.88rem] leading-[1.85] text-[var(--color-muted)] sm:text-[0.92rem]";
  const labelClass =
    "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";
  const inputClass =
    "mt-2 w-full rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.82)] px-3.5 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-soft)] focus:border-[var(--color-line-strong)]";
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
    <main lang={locale} className={pageShellClass}>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className={panelClass}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-line-strong)] px-3 py-1 font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-accent)]">
              /admin
            </span>
            <a
              href={`/${locale}`}
              className="rounded-full border border-[var(--color-line)] px-3 py-1 font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-text)] transition-opacity duration-150 ease-out hover:opacity-80"
            >
              {copy.backToPortfolioLabel}
            </a>
            <button
              type="button"
              onClick={signOut}
              disabled={isSigningOut}
              className="rounded-full border border-[var(--color-line)] px-3 py-1 font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-text)] transition-opacity duration-150 ease-out hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSigningOut ? copy.signingOutLabel : copy.signOutLabel}
            </button>
          </div>

          <div className="mt-6 max-w-4xl space-y-4 border-b border-[var(--color-line)] pb-6">
            <p className={labelClass}>{copy.eyebrow}</p>
            <h1 className={titleClass}>{copy.title}</h1>
            <p className={`${bodyClass} max-w-3xl text-pretty`}>{copy.description}</p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
            <div className="space-y-6">
              <section className="rounded-[1.25rem] border border-[var(--color-line)] bg-[rgba(10,20,16,0.68)] p-4">
                <p className={labelClass}>{copy.currentUserLabel}</p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {currentUser?.email ?? "-"}
                  </p>
                  <p className={bodyClass}>
                    {copy.roleLabel}:{" "}
                    {currentUser ? roleLabelByValue[currentUser.role] : "-"}
                  </p>
                  <p className={bodyClass}>
                    {canManageUsers
                      ? copy.permissionsManageUsersLabel
                      : canEditInquiries
                        ? copy.permissionsWriteLabel
                        : copy.permissionsReadOnlyLabel}
                  </p>
                </div>
              </section>

              <section className="rounded-[1.25rem] border border-[var(--color-line)] bg-[rgba(10,20,16,0.68)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className={labelClass}>{copy.sessionsLabel}</p>
                  <button
                    type="button"
                    onClick={logoutEverywhere}
                    disabled={isRevokingEverywhere}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.04em] text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRevokingEverywhere
                      ? copy.loggingOutEverywhereLabel
                      : copy.logoutEverywhereLabel}
                  </button>
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
                        className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                            {session.isCurrent ? copy.sessionsCurrentLabel : session.id}
                          </p>
                          <button
                            type="button"
                            onClick={() => revokeSession(session.id)}
                            disabled={revokingSessionId === session.id}
                            className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.04em] text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {revokingSessionId === session.id
                              ? copy.revokingSessionLabel
                              : copy.revokeSessionLabel}
                          </button>
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
                <section className="rounded-[1.25rem] border border-[var(--color-line)] bg-[rgba(10,20,16,0.68)] p-4">
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
                          className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4"
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
                              saveUserRole(
                                user.id,
                                event.target.value as UserItem["role"],
                              )
                            }
                            disabled={savingUserId === user.id}
                            className={inputClass}
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

              <section className="rounded-[1.25rem] border border-[var(--color-line)] bg-[rgba(10,20,16,0.68)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className={labelClass}>{copy.inquiriesLabel}</p>
                  <span className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                    {totalResults} {copy.resultsLabel}
                  </span>
                </div>

                <div className="mt-4 grid gap-4">
                  <div className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
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
                          className={inputClass}
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
                          className={inputClass}
                        >
                          <option value="all">{copy.statusAllLabel}</option>
                          <option value="new">{copy.statusNewLabel}</option>
                          <option value="in_progress">
                            {copy.statusInProgressLabel}
                          </option>
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
                          className={`w-full rounded-[1rem] border px-4 py-3 text-left transition-colors ${
                            isActive
                              ? "border-[var(--color-line-strong)] bg-[rgba(111,247,166,0.1)]"
                              : "border-[var(--color-line)] bg-[rgba(6,12,9,0.7)]"
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

                <div className="mt-4 flex items-center justify-between gap-3 rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
                  <p className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                    {copy.pageLabel} {currentPage} / {totalPages}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage <= 1 || isLoadingList}
                      className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {copy.previousPageLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={currentPage >= totalPages || isLoadingList}
                      className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {copy.nextPageLabel}
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              {statusMessage ? (
                <section className={panelClass}>
                  <p className="text-sm text-[var(--color-accent)]">{statusMessage}</p>
                </section>
              ) : null}

              <section className={panelClass}>
                <div className="flex items-center justify-between gap-3">
                  <p className={labelClass}>{copy.detailsLabel}</p>
                  {detailInquiry ? (
                    <button
                      type="button"
                      onClick={fetchSummary}
                      disabled={isLoadingSummary}
                      className="inline-flex items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-accent)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-[#041009] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoadingSummary
                        ? copy.generatingSummaryLabel
                        : copy.generateSummaryLabel}
                    </button>
                  ) : null}
                </div>

                {detailInquiry ? (
                  <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
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
                            className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4"
                          >
                            <p className={labelClass}>{label}</p>
                            <p className="mt-2 text-sm text-[var(--color-text)]">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
                        <p className={labelClass}>{copy.messageLabel}</p>
                        <p className={`${bodyClass} mt-3 whitespace-pre-wrap`}>
                          {detailInquiry.message}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
                        <p className={labelClass}>{copy.createdAtLabel}</p>
                        <p className="mt-2 text-sm text-[var(--color-text)]">
                          {new Date(detailInquiry.createdAt).toLocaleString(locale)}
                        </p>
                      </div>

                      <div className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
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

              <section className={panelClass}>
                <div className="flex items-center justify-between gap-3">
                  <p className={labelClass}>{copy.workflowLabel}</p>
                  {detailInquiry && canEditInquiries ? (
                    <button
                      type="button"
                      onClick={saveInquiryChanges}
                      disabled={isSavingChanges}
                      className="inline-flex items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-accent)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-[#041009] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingChanges ? copy.savingChangesLabel : copy.saveChangesLabel}
                    </button>
                  ) : null}
                </div>

                {detailInquiry ? (
                  <div className="mt-4 grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                    <div className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
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
                        className={inputClass}
                      >
                        <option value="new">{copy.statusNewLabel}</option>
                        <option value="in_progress">{copy.statusInProgressLabel}</option>
                        <option value="handled">{copy.statusHandledLabel}</option>
                      </select>
                    </div>

                    <div className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
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
                        className={`${inputClass} min-h-32 resize-y`}
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

              <section className={panelClass}>
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
                        className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4"
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
                              ? statusLabelByValue[
                                  activity.statusTo as InquiryItem["status"]
                                ]
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

              <section className={panelClass}>
                <p className={labelClass}>{copy.summaryLabel}</p>
                {summary ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
                      <p className={labelClass}>{copy.summaryResultLabel}</p>
                      <p className={`${bodyClass} mt-3 whitespace-pre-wrap`}>
                        {summary.summary}
                      </p>
                    </div>
                    <div className="rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.74)] p-4">
                      <p className={labelClass}>{copy.summaryPromptLabel}</p>
                      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-[0.72rem] leading-6 text-[var(--color-soft)]">
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
        </section>
      </div>
    </main>
  );
}
