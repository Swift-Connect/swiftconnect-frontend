import { Menu, Bell, MessageSquare } from "lucide-react";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

export default function Header({ setHideSideMenu, user, setActiveSidebar, searchItems }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowMessages(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock data - replace with actual API calls
  const notifications = [
    { id: 1, message: "Your electricity bill payment was successful", time: "2 hours ago", read: false },
    { id: 2, message: "New data plan available", time: "1 day ago", read: true },
    { id: 3, message: "Account verification completed", time: "3 days ago", read: true }
  ];

  const messages = [
    { id: 1, sender: "Support Team", message: "How can we help you today?", time: "1 hour ago", unread: true },
    { id: 2, sender: "System", message: "Welcome to SwiftConnect!", time: "2 days ago", unread: false }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  return (
    <header className="flex max-md-[400px]:w-full justify-between items-center bg-white py-4 px-8 max-md-[400px]:px-2 header-shadow max-md-[400px]:gap-4 sticky top-0 z-30">
      <Menu
        onClick={() => setHideSideMenu(false)}
        className="max-md-[400px]:block hidden cursor-pointer"
      />
      <h1 className="text-[1em] text-[#101828] font-semibold">
        Welcome back, {user?.username}
      </h1>
      <div className="flex items-center gap-4">
        <SearchBar
          setActiveSidebar={setActiveSidebar}
          searchItems={searchItems}
        />

        {/* Messages Dropdown */}
        <div className="relative" ref={messageRef}>
          <button
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
            }}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Messages"
          >
            <MessageSquare className="w-6 h-6 text-gray-600" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>
          
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Messages</h3>
              </div>
              <div className="p-2">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        message.unread ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{message.sender}</p>
                          <p className="text-sm text-gray-600 truncate">{message.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                        </div>
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No messages</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
}
