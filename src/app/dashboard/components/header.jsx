import { Menu, Bell, MessageSquare } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { openWhatsAppSupport, SUPPORT_MESSAGES } from "@/utils/whatsappSupport";

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

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="flex w-full justify-between items-center bg-white py-4 px-4 sm:px-8 header-shadow gap-2 sm:gap-4 sticky top-0 z-30">
      <Menu
        onClick={() => setHideSideMenu(false)}
        className="md:hidden block cursor-pointer w-6 h-6"
      />
      <h1 className="text-sm sm:text-base text-[#101828] font-semibold">
        Welcome back, {user?.username}
      </h1>
      <div className="flex items-center gap-2 sm:gap-4">
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
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
          
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Support</h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <div className="mb-4">
                    <FaWhatsapp className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-2">Get Support via WhatsApp</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Chat with our support team directly on WhatsApp for quick assistance
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      openWhatsAppSupport(SUPPORT_MESSAGES.GENERAL);
                      setShowMessages(false);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp />
                    Open WhatsApp Support
                  </button>
                </div>
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
