export interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  provider?: string;
  isLoading?: boolean;
  providerRevealed?: boolean;
  metrics?: MessageMetrics;
  showMessageStats?: boolean;
}

export interface MessageMetrics {
  inputTokens: number;
  outputTokens: number;
  tokensPerSecond: number;
  latency: string;
  cost: string;
  saved: string;
}

export interface ChatWindowProps {
  id: string;
  messages: Message[];
  showMessageStats: boolean;
  onClose: (id: string) => void;
  isMain: boolean;
}

export type ChatWindowType = {
  id: string;
  messages: Message[];
  selectedProvider: string | null;
};
