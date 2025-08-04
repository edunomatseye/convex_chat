import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Channel {
  _id: Id<"channels">;
  name: string;
  createdBy: Id<"users">;
  _creationTime: number;
}

interface MessagePaneProps {
  channel: Channel;
  channelId: Id<"channels">;
}

export function MessagePane({ channel, channelId }: MessagePaneProps) {
  const [newMessage, setNewMessage] = useState("");
  const messages = useQuery(api.messages.list, { channelId });
  const sendMessage = useMutation(api.messages.send);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        channelId,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Channel Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">#</span>
          <h2 className="text-xl font-semibold text-gray-900">{channel.name}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages?.map((message) => (
          <div key={message._id} className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message.author.avatarUrl ? (
                <img
                  src={message.author.avatarUrl}
                  alt={message.author.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {message.author.name[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-gray-900">
                  {message.author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(message._creationTime)}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage}>
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${channel.name}`}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
