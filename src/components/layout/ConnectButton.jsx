import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import Text from "../ui/text";
import useAuth from "../../hooks/useAuth";

function ConnectButton() {
  const { connector, active, account } = useWeb3React();
  const { login, logout, error } = useAuth();
  const [isLoading, setIsLoading] = useState({
    metamask: false,
    walletconnect: false,
  });
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [isWalletConnectConnected, setIsWalletConnectConnected] = useState(false);

  

  // Check the actual connection state
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          const isConnected = accounts && accounts.length > 0;
          setIsMetaMaskConnected(isConnected && localStorage.getItem("connectorId") === "injected");
        } catch (error) {
          console.error("Error checking MetaMask connection:", error);
          setIsMetaMaskConnected(false);
        }
      } else {
        setIsMetaMaskConnected(false);
      }
    };
    
    const checkWalletConnectConnection = () => {
      setIsWalletConnectConnected(active && localStorage.getItem("connectorId") === "walletconnect");
    };
    
    checkMetaMaskConnection();
    checkWalletConnectConnection();
    
    // Set up interval to periodically check connection status
    const intervalId = setInterval(() => {
      checkMetaMaskConnection();
      checkWalletConnectConnection();
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [active, account]);

  // Attempt to reconnect on initial load
  useEffect(() => {
    const connectorId = localStorage.getItem("connectorId");
    if (connectorId && !active) {
      const connectStoredWallet = async () => {
        try {
          await login(connectorId);
        } catch (error) {
          console.error("Error reconnecting wallet:", error);
          // Clear localStorage as a fallback
          localStorage.removeItem("connectorId");
        }
      };
      connectStoredWallet();
    }
  }, [login, active]);

  // Listen for MetaMask account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          console.log("MetaMask disconnected");
          localStorage.removeItem("connectorId");
          setIsMetaMaskConnected(false);
        } else if (localStorage.getItem("connectorId") === "injected") {
          setIsMetaMaskConnected(true);
        }
      };
      
      const handleChainChanged = () => {
        // Force page refresh on chain change
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connectMetaMask = async () => {
    if (isMetaMaskConnected) {
      try {
        setIsLoading((prev) => ({...prev, metamask: true}));
        await logout();
        setIsMetaMaskConnected(false);
        toast.info("Disconnected from MetaMask");
      } catch (error) {
        console.error("Error disconnecting MetaMask:", error);
        toast.error("Failed to disconnect MetaMask");
      } finally {
        setIsLoading(prev => ({...prev, metamask: false}));
      }
      return;
    }
    
    setIsLoading((prev) => ({...prev, metamask: true}));
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }
      
      // Request accounts explicitly before activating
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await login("injected");
      setIsMetaMaskConnected(true);
      toast.success("Connected to MetaMask successfully");
    } catch (error) {
      console.error("MetaMask connection error:", error.message);
      toast.error("Failed to connect to MetaMask ");
    } finally {
      setIsLoading(prev => ({...prev, metamask: false}));
    }
  };
  
  const connectWalletConnect = async () => {
    if (isWalletConnectConnected) {
      try {
        setIsLoading((prev) => ({...prev, walletconnect: true}));
        await logout();
        setIsWalletConnectConnected(false);
        toast.info("Disconnected from WalletConnect");
      } catch (error) {
        console.error("Error disconnecting WalletConnect:", error);
        toast.error("Failed to disconnect WalletConnect");
      } finally {
        setIsLoading(prev => ({...prev, walletconnect: false}));
      }
      return;
    }
    
    setIsLoading((prev) => ({...prev, walletconnect: true}));
    
    try {
      await login("walletconnect");
      setIsWalletConnectConnected(true);
      toast.success("Connected to WalletConnect successfully");
    } catch (error) {
      console.error("WalletConnect error:", error.message);
      toast.error("Failed to connect with WalletConnect ");
    } finally {
      setIsLoading(prev => ({...prev, walletconnect: false}));
    }
  };
  
  const formattedAddress = account
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : '';

  const renderAddress = () => {
    if (!formattedAddress) return null;
    
    return (
      <div className="flex items-center justify-center mt-2">
        <Text variant="small" color="secondary">
          Connected: {formattedAddress}
        </Text>
      </div>
    );
  };

  return (
    <div className="connect-wallet-container w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant={isMetaMaskConnected ? "destructive" : "outline"}
          className="py-5"
          onClick={connectMetaMask}
          disabled={
            isLoading.metamask || (isLoading.walletconnect && !isWalletConnectConnected)
          }
        >
          {isLoading.metamask
            ? "Connecting..."
            : isMetaMaskConnected
            ? "Disconnect MetaMask"
            : "Connect MetaMask"}
        </Button>

        <Button
          variant={isWalletConnectConnected ? "destructive" : "outline"}
          className="py-5"
          onClick={connectWalletConnect}
          disabled={
            isLoading.walletconnect || (isLoading.metamask && !isMetaMaskConnected)
          }
        >
          {isLoading.walletconnect
            ? "Connecting..."
            : isWalletConnectConnected
            ? "Disconnect WalletConnect"
            : "Connect WalletConnect"}
        </Button>
      </div>

      {(isMetaMaskConnected || isWalletConnectConnected) && renderAddress()}
    </div>
  );
}

export default ConnectButton;
