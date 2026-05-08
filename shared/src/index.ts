export type Role = "ADMIN" | "AGENT";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CONVERTED"
  | "LOST";

export type CallDirection = "INBOUND" | "OUTBOUND";

export type CallStatus = "ANSWERED" | "MISSED" | "BUSY" | "FAILED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  status: LeadStatus;
  source?: string | null;
  ownerId?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface CallLog {
  id: string;
  leadId?: string | null;
  agentId: string;
  direction: CallDirection;
  fromNumber: string;
  toNumber: string;
  status: CallStatus;
  duration: number;
  recordingUrl?: string | null;
  startedAt: string;
  endedAt?: string | null;
}

export interface Reminder {
  id: string;
  leadId: string;
  agentId: string;
  dueAt: string;
  note?: string | null;
  done: boolean;
  createdAt: string;
}
