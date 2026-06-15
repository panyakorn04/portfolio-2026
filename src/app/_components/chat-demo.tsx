"use client";

import type { PortfolioDictionary } from "../_data/portfolio";
import { useChatDemo } from "../_hooks/use-chat-demo";
import ChatDemoView from "./chat-demo-view";

type ChatCopy = PortfolioDictionary["chat"];

export default function ChatDemo({ copy }: { copy: ChatCopy }) {
  const {
    chatEndRef,
    chatLogRef,
    closeChat,
    draft,
    handleDraftChange,
    handleDraftKeyDown,
    handleSubmit,
    isOpen,
    isWaiting,
    messages,
    textareaRef,
    toggleChat,
  } = useChatDemo(copy);

  return (
    <ChatDemoView
      chatLogRef={chatLogRef}
      chatEndRef={chatEndRef}
      copy={copy}
      draft={draft}
      isOpen={isOpen}
      isWaiting={isWaiting}
      messages={messages}
      onClose={closeChat}
      onDraftChange={handleDraftChange}
      onDraftKeyDown={handleDraftKeyDown}
      onSubmit={handleSubmit}
      onToggle={toggleChat}
      textareaRef={textareaRef}
    />
  );
}
