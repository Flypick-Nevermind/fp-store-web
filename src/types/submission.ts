export type SubmissionLinkStatus =
  | "PENDING"
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "NEEDS_CONFIRMATION";

export interface SubmissionItemLink {
  id: string;
  url: string;
  domain?: string;
  userNotes?: string; // Catatan spesifikasi dari user (warna, size, kuantitas)
  status: SubmissionLinkStatus;
  adminNotes?: string; // Catatan/keterangan manual dari admin
  priceCny?: number;
  priceIdr?: number;
  isChecked?: boolean;
}

export type SubmissionStatus = "PENDING_REVIEW" | "REVIEWED" | "NOTIFIED";

export type NotificationChannel = "EMAIL" | "WHATSAPP";

export type NotificationPreference = "WHATSAPP" | "EMAIL" | "BOTH";

export interface NotificationLog {
  id: string;
  sentAt: string;
  channels: NotificationChannel[];
  message: string;
  recipientEmail?: string;
  recipientPhone?: string;
}

export interface SubmissionRecord {
  id: string; // e.g. "SUB-202610-8912"
  createdAt: string;
  updatedAt: string;
  userId?: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  warehouseCode?: string;
  notificationPreference?: NotificationPreference;
  links: SubmissionItemLink[];
  status: SubmissionStatus;
  reviewedAt?: string;
  reviewerName?: string;
  overallAdminNotes?: string;
  notifications: NotificationLog[];
}

export interface CreateSubmissionInput {
  userName: string;
  userPhone: string;
  userEmail?: string;
  userId?: string;
  warehouseCode?: string;
  notificationPreference?: NotificationPreference;
  links: {
    url: string;
    userNotes?: string;
  }[];
}
