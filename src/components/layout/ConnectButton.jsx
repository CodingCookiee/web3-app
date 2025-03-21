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

  // Show errors from useAuth
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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

  const connectMetaMask = async () => {
    const isMetaMaskConnected = active && localStorage.getItem("connectorId") === "injected";
    
    if (isMetaMaskConnected) {
      try {
        setIsLoading((prev) => ({...prev, metamask: true}));
        await logout();
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
      
      
      await login("injected");
      
      // Verify that we're actually connected before showing success
      if (window.ethereum.selectedAddress) {
        toast.success("Connected to MetaMask successfully");
      } else {
        throw new Error("MetaMask connection was rejected");
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      toast.error("Failed to connect to MetaMask: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(prev => ({...prev, metamask: false}));
    }
  };
  
  const connectWalletConnect = async () => {
    const isWalletConnectConnected = active && localStorage.getItem("connectorId") === "walletconnect";
    
    if (isWalletConnectConnected) {
      try {
        setIsLoading((prev) => ({...prev, walletconnect: true}));
        await logout();
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
      toast.success("Connected to WalletConnect successfully");
    } catch (error) {
      console.error("WalletConnect error:", error);
      toast.error("Failed to connect with WalletConnect: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(prev => ({...prev, walletconnect: false}));
    }
  };
  
  const formattedAddress = account
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : '';

  const isMetaMaskConnected = active && localStorage.getItem("connectorId") === "injected";
  const isWalletConnectConnected = active && localStorage.getItem("connectorId") === "walletconnect";

  const renderAddress = () => {
    return (
      <div className="flex items-center justify-center mt-2">
        <Text variant="small" color="primary">
          Connected: {formattedAddress}
        </Text>
      </div>
    );
  };

  return (
    <div className="connect-wallet-container w-full h-full">
      <div className="w-full flex flex-col sm:flex-row gap-5">
        <div className="meta-btn w-full ">

        <Button
          variant={isMetaMaskConnected ? "destructive" : "outline"}
          className="py-5 w-full max-w-2xs"
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

        </div>
        <div className="walletconnect-btn w-full ">
        <Button
          variant={isWalletConnectConnected ? "destructive" : "outline"}
          className="py-5 w-full max-w-2xs"
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
      </div>

      <div className="h-full w-full">
      {active && renderAddress()}
      </div>
    </div>
  );
}

export default ConnectButton;
