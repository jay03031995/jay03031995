import { create } from 'zustand';

interface Message {
  id: string;
  content: string;
  sender_type: 'visitor' | 'agent' | 'ai';
  created_at: string;
  channel: string;
}

interface ChatState {
  conversations: any[];
  activeConversation: any | null;
  messages: Message[];
  setConversations: (convs: any[]) => void;
  setActiveConversation: (conv: any) => void;
  addMessage: (msg: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (activeConversation) => set({ activeConversation }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));
