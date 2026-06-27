import { NextResponse } from "next/server";

export type ApiErrorDetail = {
  field: string;
  message: string;
};

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      ok: true,
      data,
    },
    init,
  );
}

export function jsonError(
  message: string,
  init?: ResponseInit & {
    details?: ApiErrorDetail[];
  },
) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        message,
        details: init?.details ?? [],
      },
    },
    {
      status: init?.status ?? 400,
      headers: init?.headers,
    },
  );
}
