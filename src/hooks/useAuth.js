import { useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { connectorsByName } from '../lib/web3React';

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const [error, setError] = useState(null);

  const login = useCallback(
    async (connectorID) => {
      const connector = connectorsByName[connectorID];
      if (!connector) {
        setError('Invalid connector');
        return;
      }

      try {
        setError(null);
        await activate(connector, null, true);
        // Store the connector ID for eager connect
        window.localStorage.setItem('connectorId', connectorID);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [activate]
  );

  const logout = useCallback(() => {
    deactivate();
    // Remove the connector ID from local storage
    window.localStorage.removeItem('connectorId');
  }, [deactivate]);

  return { login, logout, error };
};

export default useAuth;