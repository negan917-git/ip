export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Message {
  id: number;
  text: string;
  source: string;
  emotion: string | null;
  isComplaint: boolean | null;
  category: string | null;
  priority: string | null;
  summary: string | null;
  createdAt: string;
  userId: number | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: Pagination;
}

export interface AnalysisResult {
  id: number;
  text: string;
  source: string;
  emotion: string;
  isComplaint: boolean;
  category: string;
  priority: string;
  summary: string;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalMessages: number;
  complaints: number;
  positiveMessages: number;
  negativeMessages: number;
  highPriority: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface BotStatus {
  isConnected: boolean;
  botName: string | null;
  createdAt: string | null;
}
