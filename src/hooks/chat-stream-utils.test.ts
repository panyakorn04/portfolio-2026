import { describe, expect, test } from "bun:test";

import {
  buildFallbackMessages,
  extractSseData,
  extractSseFrames,
} from "./chat-stream-utils";

describe("chat stream utilities", () => {
  test("does not duplicate the latest user message in fallback payloads", () => {
    const messages = [
      { role: "assistant" as const, text: "Hello" },
      { role: "user" as const, text: "Tell me about your work" },
    ];

    expect(buildFallbackMessages(messages)).toEqual([
      { role: "assistant", content: "Hello" },
      { role: "user", content: "Tell me about your work" },
    ]);
  });

  test("parses LF and CRLF SSE frame boundaries", () => {
    expect(extractSseFrames('data: {"delta":"a"}\n\ndata: {"delta":"b"}\n\n')).toEqual({
      frames: ['data: {"delta":"a"}', 'data: {"delta":"b"}'],
      remainder: "",
    });
    expect(extractSseFrames('data: {"delta":"a"}\r\n\r\ndata: partial')).toEqual({
      frames: ['data: {"delta":"a"}'],
      remainder: "data: partial",
    });
  });

  test("joins multi-line SSE data fields", () => {
    expect(extractSseData("event: message\r\ndata: first\r\ndata: second")).toBe(
      "first\nsecond",
    );
  });
});
