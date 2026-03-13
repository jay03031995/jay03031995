"use client";

import React, { useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { MessageCircle, Send, User, Globe, Phone, Facebook, Instagram } from 'lucide-react';

export default function Inbox() {
  const { conversations, activeConversation, setActiveConversation, messages, addMessage } = useChatStore();

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <Phone size={16} className="text-green-500" />;
      case 'facebook': return <Facebook size={16} className="text-blue-600" />;
      case 'instagram': return <Instagram size={16} className="text-pink-500" />;
      default: return <Globe size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Panel: Conversation List */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b font-bold text-lg">Conversations</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${activeConversation?.id === conv.id ? 'bg-blue-50' : ''}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  {getChannelIcon(conv.channel)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{conv.visitor_name || 'Anonymous'}</div>
                <div className="text-xs text-gray-500 truncate">{conv.last_message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel: Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <div className="font-bold">{activeConversation.visitor_name || 'Chat Session'}</div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender_type === 'visitor' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender_type === 'visitor' ? 'bg-gray-100 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      {/* Right Panel: Visitor Intelligence */}
      <div className="w-80 border-l bg-white p-4">
        <div className="font-bold mb-4">Visitor Intelligence</div>
        {activeConversation ? (
          <div className="space-y-4">
            <div className="text-sm">
              <label className="text-gray-500 block">Location</label>
              <div>{activeConversation.location || 'Unknown'}</div>
            </div>
            <div className="text-sm">
              <label className="text-gray-500 block">Device</label>
              <div>{activeConversation.device || 'Unknown'}</div>
            </div>
            <div className="text-sm">
              <label className="text-gray-500 block">Current Page</label>
              <div className="text-blue-500 truncate">{activeConversation.current_page || '/'}</div>
            </div>
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-bold mb-2">Lead Status</h3>
              <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded inline-block">
                Hot Lead (Sales Intent)
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No visitor data available</div>
        )}
      </div>
    </div>
  );
}
