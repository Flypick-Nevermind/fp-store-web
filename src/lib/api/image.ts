import { apiClient } from "@/lib/api-client";
import type { UploadImageResponseData } from "@/types/api";

/**
 * Upload an image file (e.g., payment proof receipt, product screenshot, or unboxing inspection photo).
 * Calls POST /api/v1/images/upload.
 * Sends both "image" and "file" field names for maximum backend compatibility.
 */
export async function uploadImageApi(
  file: File,
  token?: string,
): Promise<UploadImageResponseData> {
  const formData = new FormData();
  // Support both "image" (GoFiber default) and "file" form keys
  formData.append("image", file);
  formData.append("file", file);

  const res = await apiClient<UploadImageResponseData>(
    "/api/v1/images/upload",
    {
      method: "POST",
      body: formData,
      token,
    },
  );

  // Normalize key from Wasabi S3 response
  const key = res.object_key || res.media_key || res.key || "";
  const resolvedUrl = key
    ? `/api/v1/images/media/${encodeURIComponent(key)}`
    : (res.url || res.file_url || "");

  return {
    url: resolvedUrl,
    object_key: key,
    media_key: key,
    file_url: resolvedUrl,
  };
}
