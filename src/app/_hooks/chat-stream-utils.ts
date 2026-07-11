export type ChatApiMessage = {
  role: "assistant" | "user";
  content: string;
};

type MessageLike = {
  role: "assistant" | "user";
  text: string;
};

export function buildFallbackMessages(
  messages: MessageLike[],
  limit = 12,
): ChatApiMessage[] {
  return messages
    .filter((message) => message.text.trim() !== "")
    .map((message) => ({ role: message.role, content: message.text }))
    .slice(-limit);
}

export function extractSseFrames(buffer: string): {
  frames: string[];
  remainder: string;
} {
  const normalized = buffer.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const parts = normalized.split("\n\n");
  return {
    frames: parts.slice(0, -1),
    remainder: parts.at(-1) ?? "",
  };
}

export function extractSseData(rawEvent: string): string {
  return rawEvent
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
}
