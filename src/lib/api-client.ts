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

/**
 * Extracts and formats human-readable details from backend error objects/arrays
 */
export function formatErrorDetails(errors: unknown): string | null {
  if (!errors) return null;
  if (typeof errors === "string") return errors;

  if (Array.isArray(errors)) {
    const list = errors
      .map((item: unknown) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const rec = item as Record<string, unknown>;
          if (rec.field && rec.message) {
            return `${String(rec.field)}: ${String(rec.message)}`;
          }
          if (rec.msg) {
            const loc = Array.isArray(rec.loc) ? rec.loc.join(".") : "";
            return loc ? `${loc}: ${String(rec.msg)}` : String(rec.msg);
          }
          return JSON.stringify(rec);
        }
        return String(item);
      })
      .filter(Boolean);
    return list.length > 0 ? list.join("; ") : null;
  }

  if (typeof errors === "object") {
    const entries = Object.entries(errors as Record<string, unknown>)
      .map(([key, val]) => {
        if (Array.isArray(val)) return `${key}: ${val.join(", ")}`;
        if (val && typeof val === "object") {
          return `${key}: ${JSON.stringify(val)}`;
        }
        return `${key}: ${String(val)}`;
      })
      .filter(Boolean);
    return entries.length > 0 ? entries.join("; ") : null;
  }

  return String(errors);
}

/**
 * Universally formats any thrown error (ApiError, standard Error, or unknown) into a clean user-facing string
 */
export function formatApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const details = formatErrorDetails(err.errors);
    if (details && !err.message.includes(details)) {
      return `${err.message} (${details})`;
    }
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Terjadi kendala pada server. Silakan coba lagi.";
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

    const rawAny = (data as unknown as Record<string, unknown>) || {};
    const detailMsg =
      typeof rawAny.detail === "string"
        ? rawAny.detail
        : Array.isArray(rawAny.detail)
          ? rawAny.detail
              .map((d: unknown) => {
                if (typeof d === "string") return d;
                const obj = d as Record<string, unknown>;
                return (
                  (obj?.msg as string) ||
                  (obj?.message as string) ||
                  JSON.stringify(d)
                );
              })
              .join("; ")
          : undefined;

    const baseMessage =
      data?.message ||
      detailMsg ||
      (typeof rawAny.error === "string" ? rawAny.error : undefined) ||
      `Terjadi kesalahan pada server (${response.status})`;

    const finalErrors = data?.errors || rawAny.detail || rawAny.errors;
    const formattedDetails = formatErrorDetails(finalErrors);

    const fullMessage =
      formattedDetails && !baseMessage.includes(formattedDetails)
        ? `${baseMessage}: ${formattedDetails}`
        : baseMessage;

    throw new ApiError(
      fullMessage,
      data?.code || response.status,
      finalErrors,
      data?.request_id,
    );
  }

  return (data.data as T) ?? (data as unknown as T);
}
