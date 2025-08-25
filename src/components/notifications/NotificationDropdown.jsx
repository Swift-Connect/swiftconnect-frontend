import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaSync } from 'react-icons/fa';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'react-toastify';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { 
    notifications, 
    loading, 
    stats, 
    markAsRead, 
    markAllAsRead,
    fetchNotifications
  } = useNotifications(false);

  const unreadCount = stats?.unread_notifications || 0;

  // Show refresh indicator every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setLastRefresh(new Date());
      // Hide the indicator after 2 seconds
      setTimeout(() => setIsRefreshing(false), 2000);
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    const success = await markAsRead(notificationId);
    if (success) {
      toast.success('Notification marked as read');
    } else {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (result) {
      toast.success(`Marked ${result.count} notifications as read`);
    } else {
      toast.error('Failed to mark notifications as read');
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {/* Auto-refresh indicator */}
        {isRefreshing && (
          <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            <FaSync className="w-2 h-2 animate-spin" />
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsRefreshing(true);
                  setLastRefresh(new Date());
                  fetchNotifications().finally(() => {
                    setTimeout(() => setIsRefreshing(false), 1000);
                  });
                }}
                disabled={loading || isRefreshing}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                title="Refresh notifications"
              >
                <FaSync className={`w-4 h-4 ${loading || isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm">Loading...</p>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FaBell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 transition-colors ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">
                  {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-gray-400">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
              <a
                href="/notifications"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationDropdown;
