import { useWeb3React } from "@web3-react/core";
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

const useLibrary = () => {
  const { account, library, active, connector } = useWeb3React();
  const [selectedLibrary, setSelectedLibrary] = useState(null);

  // Force refresh function to manually trigger library initialization
  const refreshLibrary = useCallback(async () => {
    if (!account) {
      setSelectedLibrary(null);
      return;
    }

    try {
      const connectorId = window.localStorage.getItem("connectorId");
      
      // For MetaMask/Injected wallet
      if (connectorId === "injected" && window.ethereum) {
        try {
          // Force request accounts to ensure connection
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            // Make sure ethers is properly imported
            if (typeof ethers !== 'undefined' && ethers.providers) {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              setSelectedLibrary(provider);
              console.log("MetaMask library initialized successfully");
            } else {
              console.error("ethers library is not properly imported");
              setSelectedLibrary(null);
            }
          } else {
            console.error("No accounts available in MetaMask");
            setSelectedLibrary(null);
          }
        } catch (err) {
          console.error("Error initializing MetaMask provider:", err);
          setSelectedLibrary(null);
        }
      } 
      // For WalletConnect
      else if (connectorId === "walletconnect" && library) {
        setSelectedLibrary(library);
        console.log("WalletConnect library initialized successfully");
      } 
      // Fallback to whatever library is provided by web3-react
      else if (library) {
        setSelectedLibrary(library);
        console.log("Using web3-react library");
      } else {
        console.error("No library available");
        setSelectedLibrary(null);
      }
    } catch (error) {
      console.error("Error initializing library:", error);
      setSelectedLibrary(null);
    }
  }, [account, library]);

  // Initialize library when dependencies change
  useEffect(() => {
    refreshLibrary();
  }, [refreshLibrary]);

  // Also check for window.ethereum changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = () => {
        refreshLibrary();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleAccountsChanged);
      };
    }
  }, [refreshLibrary]);
  
  return { selectedLibrary, refreshLibrary };
};

export default useLibrary;
