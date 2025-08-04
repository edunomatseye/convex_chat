import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface SearchModalProps {
  onClose: () => void;
  onSelectChannel: (channelId: Id<"channels">) => void;
}

export function SearchModal({ onClose, onSelectChannel }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useQuery(
    api.messages.search,
    searchQuery.trim() ? { query: searchQuery.trim() } : "skip"
  );

  const handleSelectMessage = (channelId: Id<"channels">) => {
    onSelectChannel(channelId);
    onClose();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="flex-1 text-lg outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!searchQuery.trim() ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Start typing to search messages</p>
            </div>
          ) : searchResults?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No messages found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {searchResults?.map((message) => (
                <button
                  key={message._id}
                  onClick={() => handleSelectMessage(message.channelId)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.author.avatarUrl ? (
                        <img
                          src={message.author.avatarUrl}
                          alt={message.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {message.author.name[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {message.author.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          in #{message.channelName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatTime(message._creationTime)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {highlightText(message.content, searchQuery)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
