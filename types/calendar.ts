export interface CalendarEvent {
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
}

export interface CalendarEnvironment {
  hasApiKey: boolean;
  nodeEnv: string;
}

export interface CalendarDebugResponse {
  success: boolean;
  count?: number;
  error?: {
    message: string;
  };
  environment?: CalendarEnvironment;
  events?: CalendarEvent[];
} 