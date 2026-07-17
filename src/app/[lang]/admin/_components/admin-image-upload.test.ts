import { describe, expect, mock, test } from "bun:test";

import { uploadArticleImage } from "./admin-image-upload";

describe("uploadArticleImage", () => {
  test("uploads the selected file and returns its public URL", async () => {
    const image = new File(["image-bytes"], "cover.png", { type: "image/png" });
    const fetcher = mock(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.method).toBe("POST");
      expect(init?.body).toBeInstanceOf(FormData);
      const uploadedImage = (init?.body as FormData).get("image");
      expect(uploadedImage).toBeInstanceOf(File);
      expect((uploadedImage as File).name).toBe("cover.png");
      expect((uploadedImage as File).type).toBe("image/png");

      return Response.json({
        ok: true,
        data: {
          url: "https://example.supabase.co/storage/v1/object/public/article-images/cover.png",
        },
      });
    });

    await expect(uploadArticleImage(image, fetcher)).resolves.toBe(
      "https://example.supabase.co/storage/v1/object/public/article-images/cover.png",
    );
    expect(fetcher).toHaveBeenCalledWith("/api/admin/article-images", expect.any(Object));
  });

  test("surfaces the API error message", async () => {
    const fetcher = mock(async () =>
      Response.json(
        { ok: false, error: { message: "Only PNG images are allowed." } },
        { status: 400 },
      ),
    );

    await expect(
      uploadArticleImage(new File(["bad"], "bad.txt", { type: "text/plain" }), fetcher),
    ).rejects.toThrow("Only PNG images are allowed.");
  });
});
