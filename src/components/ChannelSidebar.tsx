import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Channel {
  _id: Id<"channels">;
  name: string;
  createdBy: Id<"users">;
  _creationTime: number;
}

interface ChannelSidebarProps {
  channels: Channel[];
  selectedChannelId: Id<"channels"> | null;
  onSelectChannel: (channelId: Id<"channels">) => void;
}

export function ChannelSidebar({ channels, selectedChannelId, onSelectChannel }: ChannelSidebarProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const createChannel = useMutation(api.channels.create);

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const channelId = await createChannel({ name: newChannelName.trim() });
      setNewChannelName("");
      setShowCreateForm(false);
      onSelectChannel(channelId);
      toast.success("Channel created!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create channel");
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Channels Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Channels</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded flex items-center justify-center text-sm transition-colors"
            title="Create channel"
          >
            +
          </button>
        </div>
      </div>

      {/* Create Channel Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-700">
          <form onSubmit={handleCreateChannel} className="space-y-2">
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Channel name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewChannelName("");
                }}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto">
        {channels.map((channel) => (
          <button
            key={channel._id}
            onClick={() => onSelectChannel(channel._id)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
              selectedChannelId === channel._id ? "bg-blue-600" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">#</span>
              <span className="truncate">{channel.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
