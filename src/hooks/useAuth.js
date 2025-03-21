import { useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { metaMask } from '../connectors/metaMask';
import { walletConnectV2 } from '../connectors/walletConnectV2';

const useAuth = () => {
  const { connector } = useWeb3React();
  const [error, setError] = useState(null);

  const login = useCallback(
    async (connectorID) => {
      setError(null);
      try {
        if (connectorID === 'injected') {
          // Check if MetaMask is installed
          if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
          }
          
          // First activate MetaMask - this will trigger the popup
          await metaMask.activate();
          
          // Only set localStorage after successful activation
          window.localStorage.setItem('connectorId', connectorID);
        } else if (connectorID === 'walletconnect') {
          await walletConnectV2.activate();
          window.localStorage.setItem('connectorId', connectorID);
        } else {
          setError('Invalid connector');
          throw new Error('Invalid connector');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(err.message);
        // Remove connectorId if login fails
        window.localStorage.removeItem('connectorId');
        throw err;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      if (connector) {
        if (connector?.deactivate) {
          await connector.deactivate();
        } else {
          await connector.resetState();
        }
      }
      
      // Always clear storage regardless of success or failure
      window.localStorage.removeItem('connectorId');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      // Ensure localStorage is cleared even if there's an error
      window.localStorage.removeItem('connectorId');
    }
  }, [connector]);

  return { login, logout, error };
};

export default useAuth;
