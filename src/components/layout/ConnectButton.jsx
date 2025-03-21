
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { metaMask } from '../../connectors/metamask';
import { walletConnectV2 } from '../../connectors/walletConnectV2';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import Text from '../ui/text';
import useAuth from '../../hooks/useAuth';

function ConnectButton() {
  const { connector, isActive, account } = useWeb3React();
  const { login, logout } = useAuth();
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

  const isMetaMaskConnected = isActive && connector === metaMask;
  const isWalletConnectConnected = isActive && connector === walletConnectV2;

  const connectMetaMask = async () => {
    if (isMetaMaskConnected) {
      try {
        await logout();
        toast.info('MetaMask disconnected');
        return;
      } catch (error) {
        console.error('Error disconnecting MetaMask:', error);
        toast.error('Failed to disconnect MetaMask');
        return;
      }
    }

    setIsLoading({ ...isLoading, metamask: true });
    
    try {
      await login('injected');
      toast.success('MetaMask connected successfully!');
    } catch (error) {
      console.error('MetaMask connection error:', error);
      toast.error('Failed to connect to MetaMask: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading({ ...isLoading, metamask: false });
    }
  };

  const connectWalletConnect = async () => {
    if (isWalletConnectConnected) {
      try {
        await logout();
        toast.info('WalletConnect disconnected');
        return;
      } catch (error) {
        console.error('Error disconnecting WalletConnect:', error);
        toast.error('Failed to disconnect WalletConnect');
        return;
      }
    }

    setIsLoading({ ...isLoading, walletconnect: true });
    
    try {
      await login('walletconnect');
      toast.success('WalletConnect connected successfully!');
    } catch (error) {
      console.error('WalletConnect error:', error);
      toast.error('Failed to connect with WalletConnect: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading({ ...isLoading, walletconnect: false });
    }
  };

  const renderAddress = () => {
    if (!account) return null;
    
    const formattedAddress = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
    
    return (
      <div className="cursor-pointer hover:underline flex items-center justify-center mt-2">
        <Text variant="h5 " color="secondary">
          Connected Account: {formattedAddress}
        </Text>
      </div>
    );
  };

  return (
    <div className="connect-wallet-container w-full  flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          className="py-5 bg-indigo-500 text-amber-50 hover:text-amber-50 hover:bg-indigo-400"
          onClick={connectMetaMask}
          disabled={isLoading.metamask || (isLoading.walletconnect && !isActive)}
        >
          {isLoading.metamask
            ? 'Connecting...'
            : isMetaMaskConnected
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
            : isWalletConnectConnected
              ? 'Disconnect WalletConnect'
              : 'Connect WalletConnect'}
        </Button>
      </div>

      {isActive && renderAddress()}
    </div>
  );
}

export default ConnectButton;