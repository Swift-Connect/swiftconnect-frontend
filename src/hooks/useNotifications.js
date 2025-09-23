import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';

export const useNotifications = (isAdmin = false) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = isAdmin ? '/notifications/admin/notifications/' : '/notifications/notifications/';
      const response = await api.get(`${endpoint}?${queryString}`);
      
      // Handle both paginated and direct array responses
      let notificationsData = [];
      let paginationData = {
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        totalPages: 1
      };

      if (Array.isArray(response.data)) {
        // Direct array response (user notifications)
        notificationsData = response.data;
        paginationData = {
          count: response.data.length,
          next: null,
          previous: null,
          currentPage: 1,
          totalPages: 1
        };
      } else {
        // Paginated response (admin notifications)
        const { results, count, next, previous } = response.data;
        notificationsData = results || [];
        const pageSize = params.page_size || 20;
        const currentPage = parseInt(params.page) || 1;
        const totalPages = Math.ceil(count / pageSize);
        
        paginationData = {
          count,
          next,
          previous,
          currentPage,
          totalPages
        };
      }
      
      setNotifications(notificationsData);
      setPagination(paginationData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Fetch notification statistics
  const fetchStats = useCallback(async () => {
    try {
      const endpoint = isAdmin ? '/notifications/admin/notifications/stats/' : '/notifications/notifications/stats/';
      const response = await api.get(endpoint);
      
      // Handle both object and direct stats responses
      if (response.data && typeof response.data === 'object') {
        setStats(response.data);
      } else {
        // Fallback for unexpected response format
        setStats({
          total_notifications: 0,
          unread_notifications: 0,
          notifications_by_category: {},
          recent_notifications: []
        });
      }
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      // Set default stats on error
      setStats({
        total_notifications: 0,
        unread_notifications: 0,
        notifications_by_category: {},
        recent_notifications: []
      });
    }
  }, [isAdmin]);

  // Fetch user preferences (only for users, not admin)
  const fetchPreferences = useCallback(async () => {
    if (isAdmin) return;
    
    try {
      const response = await api.get('/notifications/preferences/');
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  }, [isAdmin]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.post(`/notifications/notifications/${notificationId}/mark_read/`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Refresh stats
      fetchStats();
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }, [fetchStats]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (category = null) => {
    try {
      const payload = category ? { category } : {};
      const response = await api.post('/notifications/notifications/mark_all_read/', payload);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          is_read: category ? 
            (notification.category === category ? true : notification.is_read) : 
            true
        }))
      );
      
      // Refresh stats
      fetchStats();
      
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return null;
    }
  }, [fetchStats]);

  // Update user preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    if (isAdmin) return false;
    
    try {
      const response = await api.put('/notifications/preferences/', newPreferences);
      setPreferences(response.data);
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }, [isAdmin]);

  // Admin functions
  const sendSingleNotification = useCallback(async (notificationData) => {
    if (!isAdmin) return false;
    
    try {
      const response = await api.post('/notifications/admin/create-single/', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending single notification:', error);
      return false;
    }
  }, [isAdmin]);

  const sendBulkNotifications = useCallback(async (notificationData) => {
    if (!isAdmin) return false;
    
    try {
      const {
        send_to_all,
        title,
        message,
        category,
        priority,
        send_email,
        send_in_app,
        user_ids
      } = notificationData || {};

      // Decide endpoint and payload based on send_to_all flag
      const endpoint = send_to_all
        ? '/notifications/admin/create-bulk-all/'
        : '/notifications/admin/create-bulk/';

      const payload = send_to_all
        ? { title, message, category, priority, send_email, send_in_app }
        : { user_ids, title, message, category, priority, send_email, send_in_app };

      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      return false;
    }
  }, [isAdmin]);

  // Get email notification history (admin only)
  const fetchEmailHistory = useCallback(async (params = {}) => {
    if (!isAdmin) return [];
    
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/notifications/admin/email-notifications/?${queryString}`);
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching email history:', error);
      return [];
    }
  }, [isAdmin]);

  // Template management (admin only)
  const fetchTemplates = useCallback(async (activeOnly = false) => {
    if (!isAdmin) return [];
    
    try {
      const endpoint = activeOnly ? '/notifications/admin/templates/active/' : '/notifications/admin/templates/';
      const response = await api.get(endpoint);
      return response.data.results || response.data || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }, [isAdmin]);

  const createTemplate = useCallback(async (templateData) => {
    if (!isAdmin) return false;
    
    try {
      const response = await api.post('/notifications/admin/templates/', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      return false;
    }
  }, [isAdmin]);

  const updateTemplate = useCallback(async (templateId, templateData) => {
    if (!isAdmin) return false;
    
    try {
      const response = await api.put(`/notifications/admin/templates/${templateId}/`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      return false;
    }
  }, [isAdmin]);

  const deleteTemplate = useCallback(async (templateId) => {
    if (!isAdmin) return false;
    
    try {
      await api.delete(`/notifications/admin/templates/${templateId}/`);
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }, [isAdmin]);

  // Note: fetchUsers is now handled by useUsers hook
  // This function is kept for backward compatibility but should be replaced
  const fetchUsers = useCallback(async (params = {}) => {
    if (!isAdmin) return [];
    
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/users/list-users/?${queryString}`);
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }, [isAdmin]);

  // Initialize data
  useEffect(() => {
    fetchNotifications();
    fetchStats();
    if (!isAdmin) {
      fetchPreferences();
    }
  }, [fetchNotifications, fetchStats, fetchPreferences, isAdmin]);

  // Auto-refresh notifications every minute
  useEffect(() => {
    // Set up interval for auto-refresh (every 60 seconds)
    const interval = setInterval(() => {
      fetchNotifications();
      fetchStats();
    }, 60000); // 60 seconds = 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchStats]);

  return {
    // State
    notifications,
    loading,
    stats,
    preferences,
    pagination,
    
    // User functions
    fetchNotifications,
    fetchStats,
    fetchPreferences,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    
    // Admin functions
    sendSingleNotification,
    sendBulkNotifications,
    fetchEmailHistory,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    fetchUsers
  };
};

// Notification categories
export const NOTIFICATION_CATEGORIES = {
  system: { label: 'System', color: 'bg-blue-100 text-blue-800' },
  account: { label: 'Account', color: 'bg-green-100 text-green-800' },
  transaction: { label: 'Transaction', color: 'bg-purple-100 text-purple-800' },
  security: { label: 'Security', color: 'bg-red-100 text-red-800' },
  referral: { label: 'Referral', color: 'bg-orange-100 text-orange-800' },
  kyc: { label: 'KYC', color: 'bg-indigo-100 text-indigo-800' }
};

// Priority levels
export const PRIORITY_LEVELS = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  normal: { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800' }
};
