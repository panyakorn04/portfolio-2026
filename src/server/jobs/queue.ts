export type JobEnvelope<TPayload> = {
  type: string;
  payload: TPayload;
  queuedAt: string;
};

export async function enqueueJob<TPayload>(type: string, payload: TPayload) {
  const job: JobEnvelope<TPayload> = {
    type,
    payload,
    queuedAt: new Date().toISOString(),
  };

  console.info("[jobs] queued job", job);

  return {
    accepted: true as const,
    job,
  };
}
