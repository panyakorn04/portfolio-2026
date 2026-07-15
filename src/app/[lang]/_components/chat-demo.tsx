"use client";

import type { PortfolioDictionary } from "@/lib/portfolio";
import { useChatDemo } from "../_hooks/use-chat-demo";
import ChatDemoView from "./chat-demo-view";

type ChatCopy = PortfolioDictionary["chat"];

export default function ChatDemo({ copy }: { copy: ChatCopy }) {
  const {
    chatEndRef,
    chatLogRef,
    closeChat,
    draft,
    handleDeleteRecentChat,
    handleDraftChange,
    handleDraftKeyDown,
    handleNewChat,
    handleQuickPrompt,
    handleRequestHuman,
    handleSelectLatestChat,
    handleSelectRecentChat,
    handleSubmit,
    humanRequestState,
    isClosing,
    isLoadingLatest,
    isOpen,
    isWaiting,
    messages,
    recentSessions,
    textareaRef,
    toggleChat,
    activeSessionKey,
  } = useChatDemo(copy);

  return (
    <ChatDemoView
      activeSessionKey={activeSessionKey}
      chatLogRef={chatLogRef}
      chatEndRef={chatEndRef}
      copy={copy}
      draft={draft}
      isClosing={isClosing}
      isLoadingLatest={isLoadingLatest}
      isOpen={isOpen}
      isWaiting={isWaiting}
      messages={messages}
      humanRequestState={humanRequestState}
      onClose={closeChat}
      onDeleteRecentChat={handleDeleteRecentChat}
      onDraftChange={handleDraftChange}
      onDraftKeyDown={handleDraftKeyDown}
      onNewChat={handleNewChat}
      onQuickPrompt={handleQuickPrompt}
      onRequestHuman={handleRequestHuman}
      onSelectLatestChat={handleSelectLatestChat}
      onSelectRecentChat={handleSelectRecentChat}
      onSubmit={handleSubmit}
      onToggle={toggleChat}
      recentSessions={recentSessions}
      textareaRef={textareaRef}
    />
  );
}
