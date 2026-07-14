"use client";

import dynamic from "next/dynamic";

const ChatDemo = dynamic(() => import("./chat-demo"), {
  ssr: false,
});

export default ChatDemo;
