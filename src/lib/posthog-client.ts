"use client";

type PosthogCaptureBody = {
  api_key: string;
  event: string;
  properties: Record<string, unknown>;
  distinct_id: string;
  timestamp: string;
};

class PosthogClient {
  private _apiKey = "";
  private _apiHost = "/ingest";
  private _distinctId = "";
  private _optedOut = false;
  private _loaded = false;

  get __loaded() {
    return this._loaded;
  }

  init(key: string, options?: { api_host?: string }) {
    if (this._loaded) return;
    this._apiKey = key;
    this._apiHost = options?.api_host ?? "/ingest";
    this._distinctId = this._getOrCreateDistinctId();
    this._loaded = true;
  }

  opt_out_capturing() {
    this._optedOut = true;
  }

  opt_in_capturing() {
    this._optedOut = false;
  }

  capture(event: string, properties: Record<string, unknown> = {}) {
    if (this._optedOut || !this._apiKey || typeof window === "undefined") return;

    const body: PosthogCaptureBody = {
      api_key: this._apiKey,
      event,
      properties: {
        ...properties,
        distinct_id: this._distinctId,
      },
      distinct_id: this._distinctId,
      timestamp: new Date().toISOString(),
    };

    fetch(`${this._apiHost}/capture/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }

  captureException(error: Error) {
    this.capture("$exception", {
      $exception_message: error.message,
      $exception_type: error.name,
      $exception_stack: error.stack,
    });
  }

  private _getOrCreateDistinctId(): string {
    try {
      let id = localStorage.getItem("ph_distinct_id");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("ph_distinct_id", id);
      }
      return id;
    } catch {
      return crypto.randomUUID();
    }
  }
}

export const posthog = new PosthogClient();
