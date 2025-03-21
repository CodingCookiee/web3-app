
import { useState, useEffect } from 'react';
import { metaMask } from '../connectors/metaMask';
import { walletConnectV2 } from '../connectors/walletConnectV2';

export default function useEagerConnect() {
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const connectSavedWallet = async () => {
      const connectorId = window.localStorage.getItem('connectorId');
      
      if (connectorId === 'injected') {
        try {
          await metaMask.connectEagerly();
        } catch (error) {
          console.error('Failed to connect eagerly to MetaMask', error);
        }
      } else if (connectorId === 'walletconnect') {
        try {
          await walletConnectV2.connectEagerly();
        } catch (error) {
          console.error('Failed to connect eagerly to WalletConnect', error);
        }
      }
      
      setTried(true);
    };

    connectSavedWallet();
  }, []);

  return tried;
}