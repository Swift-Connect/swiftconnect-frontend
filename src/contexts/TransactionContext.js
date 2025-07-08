"use client"
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

const TransactionContext = createContext();

const initialState = {
  transactions: [],
  total: 0,
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
};

function transactionReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        transactions: action.append
          ? [...state.transactions, ...action.payload.transactions]
          : action.payload.transactions,
        total: action.payload.total,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const fetchTransactions = useCallback(
    async (page = 1, pageSize = 10, append = false) => {
      dispatch({ type: 'FETCH_START' });
      try {
        const response = await axiosInstance.get(
          `/payments/transactions/?page=${page}&page_size=${pageSize}`
        );
        // Assume response.data.results and response.data.count
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            transactions: response.data.results || response.data || [],
            total: response.data.count || 0,
            page,
            pageSize,
          },
          append,
        });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', error: error.message });
      }
    },
    []
  );

  // Refetch resets to first page
  const refetch = useCallback(() => {
    fetchTransactions(1, state.pageSize, false);
  }, [fetchTransactions, state.pageSize]);

  return (
    <TransactionContext.Provider value={{ ...state, fetchTransactions, refetch }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  return useContext(TransactionContext);
} 