'use client';
import React, { useState, useEffect } from 'react';
import { FaBell, FaPlus, FaSearch, FaTimes, FaSync } from 'react-icons/fa';
import { useNotifications, NOTIFICATION_CATEGORIES, PRIORITY_LEVELS } from '@/hooks/useNotifications';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'react-toastify';

const NotificationSystem = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { stats, sendSingleNotification, sendBulkNotifications, fetchStats } = useNotifications(true);
  const { users, loading: loadingUsers, searchUsers } = useUsers();
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [pickerMode, setPickerMode] = useState('bulk'); // 'single' or 'bulk'

  const [singleNotification, setSingleNotification] = useState({
    user_id: '',
    title: '',
    message: '',
    category: 'system',
    priority: 'normal',
    send_email: true,
    send_in_app: true
  });
  const [selectedSingleUser, setSelectedSingleUser] = useState(null);

  const [bulkNotification, setBulkNotification] = useState({
    user_ids: [],
    title: '',
    message: '',
    category: 'system',
    priority: 'normal',
    send_email: true,
    send_in_app: true,
    send_to_all: false
  });

  const handleSendSingle = async (e) => {
    e.preventDefault();
    
    if (!singleNotification.user_id || !singleNotification.title || !singleNotification.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result = await sendSingleNotification(singleNotification);
    if (result) {
      toast.success('Notification sent successfully');
      setSingleNotification({
        user_id: '',
        title: '',
        message: '',
        category: 'system',
        priority: 'normal',
        send_email: true,
        send_in_app: true
      });
    } else {
      toast.error('Failed to send notification');
    }
  };

  const handleUserPickerOpen = (mode = 'bulk') => {
    setPickerMode(mode);
    setShowUserPicker(true);
  };

  const handleUserSelect = (user) => {
    if (pickerMode === 'single') {
      setSelectedSingleUser(user);
      setSingleNotification(prev => ({
        ...prev,
        user_id: user.id
      }));
      setShowUserPicker(false);
    } else {
      if (selectedUsers.find(u => u.id === user.id)) {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };

  const handleUserPickerConfirm = () => {
    setBulkNotification(prev => ({
      ...prev,
      user_ids: selectedUsers.map(u => u.id)
    }));
    setShowUserPicker(false);
  };

  const handleSingleUserSelect = (user) => {
    setSelectedSingleUser(user);
    setSingleNotification(prev => ({
      ...prev,
      user_id: user.id
    }));
  };

  const filteredUsers = searchUsers(userSearchTerm);

  const handleSendBulk = async (e) => {
    e.preventDefault();
    
    if (!bulkNotification.send_to_all && !bulkNotification.user_ids.length) {
      toast.error('Please select users or choose "Send to All Users"');
      return;
    }

    if (!bulkNotification.title || !bulkNotification.message) {
      toast.error('Please fill in title and message');
      return;
    }

    const result = await sendBulkNotifications(bulkNotification);

    if (result) {
      const targetText = bulkNotification.send_to_all ? 'all users' : `${result.success_count}/${result.total_count} users`;
      toast.success(`Notifications sent successfully to ${targetText}`);
      setBulkNotification({
        user_ids: [],
        title: '',
        message: '',
        category: 'system',
        priority: 'normal',
        send_email: true,
        send_in_app: true,
        send_to_all: false
      });
      setSelectedUsers([]);
    } else {
      toast.error('Failed to send notifications');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Notification System</h1>
            <p className="text-gray-600">Manage and send notifications to users</p>
          </div>
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchStats().finally(() => {
                setTimeout(() => setIsRefreshing(false), 1000);
              });
            }}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Refresh notification stats"
          >
            <FaSync className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Stats
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaBell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_notifications || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaBell className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.unread_notifications || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaBell className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(NOTIFICATION_CATEGORIES).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Send Notifications */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Send Notifications</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Single Notification */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Single Notification</h3>
                  <form onSubmit={handleSendSingle} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleUserPickerOpen('single')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left hover:bg-gray-50"
                        >
                          {selectedSingleUser 
                            ? `${selectedSingleUser.username || selectedSingleUser.email}` 
                            : 'Click to select user'
                          }
                        </button>
                        {selectedSingleUser && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {selectedSingleUser.username || selectedSingleUser.email}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSingleUser(null);
                                  setSingleNotification(prev => ({ ...prev, user_id: '' }));
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={singleNotification.title}
                  onChange={(e) => setSingleNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notification title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={singleNotification.message}
                  onChange={(e) => setSingleNotification(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Notification message"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={singleNotification.category}
                    onChange={(e) => setSingleNotification(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(NOTIFICATION_CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={singleNotification.priority}
                    onChange={(e) => setSingleNotification(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={singleNotification.send_email}
                    onChange={(e) => setSingleNotification(prev => ({ ...prev, send_email: e.target.checked }))}
                    className="mr-2"
                  />
                  Send Email
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={singleNotification.send_in_app}
                    onChange={(e) => setSingleNotification(prev => ({ ...prev, send_in_app: e.target.checked }))}
                    className="mr-2"
                  />
                  In-App
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Send Notification
              </button>
            </form>
          </div>

                          {/* Bulk Notification */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Notifications</h3>
                  <form onSubmit={handleSendBulk} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Users</label>
                      <div className="space-y-3">
                        {/* Send to All Users Option */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="send_to_all"
                            checked={bulkNotification.send_to_all}
                            onChange={(e) => {
                              setBulkNotification(prev => ({ 
                                ...prev, 
                                send_to_all: e.target.checked,
                                user_ids: e.target.checked ? [] : prev.user_ids
                              }));
                              if (e.target.checked) {
                                setSelectedUsers([]);
                              }
                            }}
                            className="mr-2"
                          />
                          <label htmlFor="send_to_all" className="text-sm font-medium text-gray-900">
                            Send to All Users
                          </label>
                        </div>

                        {/* User Picker (disabled when send_to_all is selected) */}
                        <div className={bulkNotification.send_to_all ? 'opacity-50 pointer-events-none' : ''}>
                          <button
                            type="button"
                            onClick={() => handleUserPickerOpen('bulk')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left hover:bg-gray-50 disabled:opacity-50"
                            disabled={bulkNotification.send_to_all}
                          >
                            {selectedUsers.length > 0 
                              ? `${selectedUsers.length} user(s) selected` 
                              : 'Click to select specific users'
                            }
                          </button>
                          {selectedUsers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedUsers.map(user => (
                                <span
                                  key={user.id}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {user.username || user.email}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <FaTimes className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Info text */}
                        {bulkNotification.send_to_all && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                              <strong>Note:</strong> This notification will be sent to all registered users in the system.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={bulkNotification.title}
                  onChange={(e) => setBulkNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notification title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={bulkNotification.message}
                  onChange={(e) => setBulkNotification(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Notification message"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={bulkNotification.category}
                    onChange={(e) => setBulkNotification(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(NOTIFICATION_CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={bulkNotification.priority}
                    onChange={(e) => setBulkNotification(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bulkNotification.send_email}
                    onChange={(e) => setBulkNotification(prev => ({ ...prev, send_email: e.target.checked }))}
                    className="mr-2"
                  />
                  Send Email
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bulkNotification.send_in_app}
                    onChange={(e) => setBulkNotification(prev => ({ ...prev, send_in_app: e.target.checked }))}
                    className="mr-2"
                  />
                  In-App
                </label>
              </div>
                                  <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      {bulkNotification.send_to_all ? 'Send to All Users' : 'Send Bulk Notifications'}
                    </button>
            </form>
          </div>
        </div>
      </div>

      {/* User Picker Modal */}
      {showUserPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {pickerMode === 'single' ? 'Select User' : 'Select Users'}
              </h2>
              <button
                onClick={() => setShowUserPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              {loadingUsers ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No users found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedUsers.find(u => u.id === user.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{user.username || 'No username'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        {pickerMode === 'bulk' && selectedUsers.find(u => u.id === user.id) && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <FaTimes className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {pickerMode === 'bulk' && (
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUserPicker(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUserPickerConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm ({selectedUsers.length} selected)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
