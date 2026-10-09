import type { ApiResponse } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://service-flypick-production.up.railway.app";

export class ApiError extends Error {
  code: number;
  errors?: unknown;
  requestId?: string;

  constructor(
    message: string,
    code: number,
    errors?: unknown,
    requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.errors = errors;
    this.requestId = requestId;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  let authToken = token;
  if (!authToken && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("flypick-auth-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        authToken = parsed?.state?.token;
      }
    } catch {
      // Ignore localStorage read errors
    }
  }

  const finalHeaders = new Headers(headers);
  if (!finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (authToken && !finalHeaders.has("Authorization")) {
    finalHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
  });

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      `Gagal memproses respon server (${response.status} ${response.statusText})`,
      response.status,
    );
  }

  if (!response.ok || !data.success) {
    if (response.status === 401 && !endpoint.includes("/auth/login")) {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("flypick-auth-storage");
        } catch {
          // Ignore storage clear error
        }
      }
    }

    throw new ApiError(
      data.message || "Terjadi kesalahan pada server",
      data.code || response.status,
      data.errors,
      data.request_id,
    );
  }

  return (data.data as T) ?? (data as unknown as T);
}
