
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { metaMask } from '../../connectors/metaMask';
import { walletConnectV2 } from '../../connectors/walletConnectV2';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import Text from '../ui/text';

function ConnectButton() {
  const { isActive, account, connector } = useWeb3React();
  const [isLoading, setIsLoading] = useState({
    metamask: false,
    walletconnect: false
  });

  // Reset loading state when connection changes
  useEffect(() => {
    if (isActive) {
      setIsLoading({
        metamask: false,
        walletconnect: false
      });
    }
  }, [isActive]);

  const connectMetaMask = async () => {
    if (isActive && connector === metaMask) {
      try {
        await connector.deactivate();
        toast.info('Wallet disconnected');
        return;
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        toast.error('Failed to disconnect wallet');
        return;
      }
    }

    setIsLoading({ ...isLoading, metamask: true });
    
    try {
      // Activate MetaMask
      await metaMask.activate();
      toast.success('MetaMask connected successfully!');
    } catch (error) {
      console.error('MetaMask connection error:', error);
      toast.error('Failed to connect to MetaMask');
    } finally {
      setIsLoading({ ...isLoading, metamask: false });
    }
  };

  const connectWalletConnect = async () => {
    if (isActive && connector === walletConnectV2) {
      try {
        await connector.deactivate();
        toast.info('Wallet disconnected');
        return;
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        toast.error('Failed to disconnect wallet');
        return;
      }
    }

    setIsLoading({ ...isLoading, walletconnect: true });
    
    try {
      // Activate WalletConnect
      await walletConnectV2.activate();
      toast.success('WalletConnect connected successfully!');
    } catch (error) {
      console.error('WalletConnect error:', error);
      toast.error('Failed to connect with WalletConnect');
    } finally {
      setIsLoading({ ...isLoading, walletconnect: false });
    }
  };

  const renderAddress = () => {
    if (!account) return null;
    
    const formattedAddress = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
    
    return (
      <div className="flex items-center justify-center mt-2">
        <Text variant="small" color="secondary">
          Connected: {formattedAddress}
        </Text>
      </div>
    );
  };

  return (
    <div className="connect-wallet-container flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          className="py-5 bg-indigo-500 text-amber-50 hover:text-amber-50 hover:bg-indigo-400"
          onClick={connectMetaMask}
          disabled={isLoading.metamask || (isLoading.walletconnect && !isActive)}
        >
          {isLoading.metamask
            ? 'Connecting...'
            : isActive && connector === metaMask
              ? 'Disconnect MetaMask'
              : 'Connect MetaMask'}
        </Button>

        <Button
          variant="outline"
          className="py-5 bg-indigo-500 text-amber-50 hover:text-amber-50 hover:bg-indigo-400"
          onClick={connectWalletConnect}
          disabled={isLoading.walletconnect || (isLoading.metamask && !isActive)}
        >
          {isLoading.walletconnect
            ? 'Connecting...'
            : isActive && connector === walletConnectV2
              ? 'Disconnect WalletConnect'
              : 'Connect WalletConnect'}
        </Button>
      </div>

      {isActive && renderAddress()}
    </div>
  );
}

export default ConnectButton;