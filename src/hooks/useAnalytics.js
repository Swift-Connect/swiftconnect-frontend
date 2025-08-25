import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/analytics/');
      setAnalytics(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh analytics every 5 minutes
  useEffect(() => {
    fetchAnalytics();
    
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  // Helper functions to format analytics data
  const formatCurrency = (amount, currency = 'NGN') => {
    const numAmount = typeof amount === 'string' 
      ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
      : amount;
    
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(numAmount || 0);
  };

  const getStatsCards = () => {
    if (!analytics) return [];

    const { users, transactions, services } = analytics;

    return [
      {
        title: 'Total Users',
        value: users?.total_users?.toLocaleString() || '0',
        icon: 'users',
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        trend: {
          value: users?.new_users_30d || 0,
          label: 'New this month',
          positive: true
        }
      },
      {
        title: 'Active Users (30d)',
        value: users?.active_users_30d?.toLocaleString() || '0',
        icon: 'active-users',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        trend: {
          value: users?.active_users_7d || 0,
          label: 'Active this week',
          positive: true
        }
      },
      // {
      //   title: 'Total Revenue',
      //   value: formatCurrency(transactions?.all_time?.total_volume || 0),
      //   icon: 'revenue',
      //   bgColor: 'bg-purple-500',
      //   textColor: 'text-white',
      //   trend: {
      //     value: transactions?.last_30d?.total_volume || 0,
      //     label: 'This month',
      //     positive: true
      //   }
      // },
      {
        title: 'Total Transactions',
        value: transactions?.all_time?.total_transactions?.toLocaleString() || '0',
        icon: 'transactions',
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        trend: {
          value: transactions?.last_30d?.total_transactions || 0,
          label: 'This month',
          positive: true
        }
      },
      {
        title: 'Pending KYC',
        value: users?.pending_kyc?.toString() || '0',
        icon: 'kyc',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        trend: {
          value: 0,
          label: 'Requires attention',
          positive: false
        }
      },
      {
        title: 'Total Wallets',
        value: services?.all_time?.total_wallets?.toLocaleString() || '0',
        icon: 'wallets',
        bgColor: 'bg-indigo-500',
        textColor: 'text-white',
        trend: {
          value: services?.last_30d?.total_wallets || 0,
          label: 'This month',
          positive: true
        }
      }
    ];
  };

  const getTransactionData = () => {
    if (!analytics?.transactions) return [];

    const { transactions } = analytics;
    
    return [
      { 
        name: '24h', 
        transactions: transactions.last_24h?.total_transactions || 0,
        volume: transactions.last_24h?.total_volume || 0,
        successful: transactions.last_24h?.successful_transactions || 0,
        failed: transactions.last_24h?.failed_transactions || 0
      },
      { 
        name: '7d', 
        transactions: transactions.last_7d?.total_transactions || 0,
        volume: transactions.last_7d?.total_volume || 0,
        successful: transactions.last_7d?.successful_transactions || 0,
        failed: transactions.last_7d?.failed_transactions || 0
      },
      { 
        name: '30d', 
        transactions: transactions.last_30d?.total_transactions || 0,
        volume: transactions.last_30d?.total_volume || 0,
        successful: transactions.last_30d?.successful_transactions || 0,
        failed: transactions.last_30d?.failed_transactions || 0
      },
      { 
        name: 'All Time', 
        transactions: transactions.all_time?.total_transactions || 0,
        volume: transactions.all_time?.total_volume || 0,
        successful: transactions.all_time?.successful_transactions || 0,
        failed: transactions.all_time?.failed_transactions || 0
      }
    ];
  };

  const getUserActivityData = () => {
    if (!analytics?.users) return [];

    const { users } = analytics;
    
    return [
      { 
        name: '24h', 
        active: users.active_users_24h || 0,
        new: users.new_users_24h || 0,
        api: users.active_users_api_24h || 0
      },
      { 
        name: '7d', 
        active: users.active_users_7d || 0,
        new: users.new_users_7d || 0,
        api: users.active_users_api_7d || 0
      },
      { 
        name: '30d', 
        active: users.active_users_30d || 0,
        new: users.new_users_30d || 0,
        api: users.active_users_api_30d || 0
      }
    ];
  };

  const getUserBreakdownData = () => {
    if (!analytics?.users) return [];

    const { users } = analytics;
    const totalUsers = users.total_users || 0;
    const activeUsers = users.active_users_30d || 0;
    const inactiveUsers = Math.max(totalUsers - activeUsers, 0);
    const verifiedUsers = users.verified_users || 0;
    const unverifiedUsers = Math.max(totalUsers - verifiedUsers, 0);

    return [
      { name: 'Active Users', value: activeUsers, color: '#10B981' },
      { name: 'Inactive Users', value: inactiveUsers, color: '#6B7280' },
      { name: 'Verified Users', value: verifiedUsers, color: '#3B82F6' },
      { name: 'Unverified Users', value: unverifiedUsers, color: '#F59E0B' }
    ];
  };

  const getServiceData = () => {
    if (!analytics?.services) return [];

    const { services } = analytics;
    
    return [
      { 
        name: '24h', 
        wallets: services.last_24h?.total_wallets || 0,
        balance: services.last_24h?.total_balance || 0,
        avgBalance: services.last_24h?.average_wallet_balance || 0
      },
      { 
        name: '7d', 
        wallets: services.last_7d?.total_wallets || 0,
        balance: services.last_7d?.total_balance || 0,
        avgBalance: services.last_7d?.average_wallet_balance || 0
      },
      { 
        name: '30d', 
        wallets: services.last_30d?.total_wallets || 0,
        balance: services.last_30d?.total_balance || 0,
        avgBalance: services.last_30d?.average_wallet_balance || 0
      },
      { 
        name: 'All Time', 
        wallets: services.all_time?.total_wallets || 0,
        balance: services.all_time?.total_balance || 0,
        avgBalance: services.all_time?.average_wallet_balance || 0
      }
    ];
  };

  const getErrorData = () => {
    if (!analytics?.errors) return [];

    const { errors } = analytics;
    
    return [
      { 
        name: '24h', 
        total: errors.last_24h?.total_errors || 0,
        payment: errors.last_24h?.payment_errors || 0,
        service: errors.last_24h?.service_errors || 0,
        system: errors.last_24h?.system_errors || 0
      },
      { 
        name: '7d', 
        total: errors.last_7d?.total_errors || 0,
        payment: errors.last_7d?.payment_errors || 0,
        service: errors.last_7d?.service_errors || 0,
        system: errors.last_7d?.system_errors || 0
      },
      { 
        name: '30d', 
        total: errors.last_30d?.total_errors || 0,
        payment: errors.last_30d?.payment_errors || 0,
        service: errors.last_30d?.service_errors || 0,
        system: errors.last_30d?.system_errors || 0
      },
      { 
        name: 'All Time', 
        total: errors.all_time?.total_errors || 0,
        payment: errors.all_time?.payment_errors || 0,
        service: errors.all_time?.service_errors || 0,
        system: errors.all_time?.system_errors || 0
      }
    ];
  };

  const getTrafficData = () => {
    if (!analytics?.traffic) return [];

    const { traffic } = analytics;
    
    return [
      { name: '24h', visitors: traffic['24h'] || 0 },
      { name: '7d', visitors: traffic['7d'] || 0 },
      { name: '30d', visitors: traffic['30d'] || 0 }
    ];
  };

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    formatCurrency,
    getStatsCards,
    getTransactionData,
    getUserActivityData,
    getUserBreakdownData,
    getServiceData,
    getErrorData,
    getTrafficData
  };
};
