export interface SavedChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface SavedChat {
  id: string;
  title: string;
  updatedAt: string;
  messages: SavedChatMessage[];
}

const MAX_CHATS = 20;
const MAX_MESSAGES_PER_CHAT = 14;
const MAX_MESSAGE_CHARS = 6_000;
// Keep this comfortably below the database sync endpoint's 2 MB per-item cap.
const MAX_HISTORY_BYTES = 1_500_000;

/** Validate and bound saved conversations before storing or displaying them. */
export function normalizeSavedChatHistory(value: unknown): SavedChat[] {
  if (!Array.isArray(value)) return [];

  const chats: SavedChat[] = value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
    .filter((item) => typeof item.id === 'string' && item.id.trim().length > 0 && Array.isArray(item.messages))
    .map((item) => ({
      id: (item.id as string).trim().slice(0, 120),
      title: typeof item.title === 'string' ? item.title.trim().slice(0, 54) : 'Study conversation',
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt.slice(0, 64) : '',
      messages: (item.messages as unknown[])
        .filter((message): message is Record<string, unknown> => Boolean(message) && typeof message === 'object' && !Array.isArray(message))
        .filter((message) => (message.sender === 'user' || message.sender === 'ai') && typeof message.text === 'string')
        .slice(-MAX_MESSAGES_PER_CHAT)
        .map((message) => ({
          sender: message.sender as 'user' | 'ai',
          text: (message.text as string).slice(0, MAX_MESSAGE_CHARS),
          timestamp: typeof message.timestamp === 'string' ? message.timestamp.slice(0, 64) : '',
        })),
    }))
    .slice(0, MAX_CHATS);

  while (chats.length > 0 && new Blob([JSON.stringify(chats)]).size > MAX_HISTORY_BYTES) {
    chats.pop(); // Drop the oldest saved conversation first.
  }
  return chats;
}
