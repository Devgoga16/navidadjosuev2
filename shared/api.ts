/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export type UserRole = "admin" | "participant";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface DrawResult {
  participantId: string;
  assignedTo: string; // name of assigned person
  assignedToId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface ParticipantsResponse {
  participants: Participant[];
}

export interface DrawResponse {
  success: boolean;
  results?: DrawResult[];
  message?: string;
}

export interface MyAssignmentResponse {
  assigned: string | null;
  message?: string;
}

export interface DemoResponse {
  message: string;
}
