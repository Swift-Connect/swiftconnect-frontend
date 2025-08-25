import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/utils/api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const lastFetchTime = useRef(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fetchUsers = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Return cached data if available and not expired
    if (!forceRefresh && hasLoaded && users.length > 0 && (now - lastFetchTime.current) < CACHE_DURATION) {
      return users;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/users/list-users/?page_size=1000');
      const usersData = response.data.results || [];
      
      setUsers(usersData);
      setHasLoaded(true);
      lastFetchTime.current = now;
      
      return usersData;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [hasLoaded, users.length]);

  const refreshUsers = useCallback(() => {
    return fetchUsers(true);
  }, [fetchUsers]);

  const getUserById = useCallback((userId) => {
    return users.find(user => user.id === userId);
  }, [users]);

  const getUsersByIds = useCallback((userIds) => {
    return users.filter(user => userIds.includes(user.id));
  }, [users]);

  const searchUsers = useCallback((searchTerm) => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.fullname?.toLowerCase().includes(term)
    );
  }, [users]);

  // Initialize users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    hasLoaded,
    fetchUsers,
    refreshUsers,
    getUserById,
    getUsersByIds,
    searchUsers
  };
};
