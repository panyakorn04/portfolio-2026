type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type UploadResponse =
  | { ok: true; data: { url: string } }
  | { ok: false; error?: { message?: string } };

export async function uploadArticleImage(
  image: File,
  fetcher: Fetcher = fetch,
): Promise<string> {
  const formData = new FormData();
  formData.set("image", image);

  const response = await fetcher("/api/admin/article-images", {
    method: "POST",
    body: formData,
  });
  const payload = (await response.json().catch(() => null)) as UploadResponse | null;

  if (!response.ok || !payload?.ok) {
    throw new Error(
      payload && !payload.ok && payload.error?.message
        ? payload.error.message
        : "Unable to upload image.",
    );
  }
  if (!payload.data.url) {
    throw new Error("Image upload response did not include a URL.");
  }
  return payload.data.url;
}
