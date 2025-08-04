import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ChannelSidebar } from "./ChannelSidebar";
import { MessagePane } from "./MessagePane";
import { ProfileModal } from "./ProfileModal";
import { SearchModal } from "./SearchModal";
import { SignOutButton } from "../SignOutButton";

export function ChatApp() {
  const [selectedChannelId, setSelectedChannelId] = useState<Id<"channels"> | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const channels = useQuery(api.channels.list);
  const profile = useQuery(api.profiles.get);

  // Auto-select first channel
  useEffect(() => {
    if (channels && channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0]._id);
    }
  }, [channels, selectedChannelId]);

  const selectedChannel = useQuery(
    api.channels.get,
    selectedChannelId ? { channelId: selectedChannelId } : "skip"
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">SlackChat</h1>
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search messages...
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Profile" className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {profile?.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <span className="text-gray-700">{profile?.name || "Profile"}</span>
          </button>
          <SignOutButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChannelSidebar
          channels={channels || []}
          selectedChannelId={selectedChannelId}
          onSelectChannel={setSelectedChannelId}
        />
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <MessagePane
              channel={selectedChannel}
              channelId={selectedChannelId!}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a channel to start chatting
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
      {showSearchModal && (
        <SearchModal
          onClose={() => setShowSearchModal(false)}
          onSelectChannel={setSelectedChannelId}
        />
      )}
    </div>
  );
}
