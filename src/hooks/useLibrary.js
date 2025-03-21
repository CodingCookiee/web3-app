import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const useLibrary = () => {
  const { account, library, active, connector } = useWeb3React();
  const [selectedLibrary, setSelectedLibrary] = useState(null);

  useEffect(() => {
    const initializeLibrary = async () => {
      // Reset library if we're not connected
      if (!active || !account) {
        setSelectedLibrary(null);
        return;
      }

      try {
        const connectorId = window.localStorage.getItem("connectorId");
        
        // For MetaMask/Injected wallet
        if (connectorId === "injected" && window.ethereum) {
          try {
            // Make sure we have permission
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setSelectedLibrary(provider);
          } catch (err) {
            console.error("Error requesting accounts:", err);
            setSelectedLibrary(null);
          }
        } 
        // For WalletConnect
        else if (connectorId === "walletconnect" && library) {
          setSelectedLibrary(library);
        } 
        // Fallback to whatever library is provided by web3-react
        else if (library) {
          setSelectedLibrary(library);
        } else {
          setSelectedLibrary(null);
        }
      } catch (error) {
        console.error("Error initializing library:", error);
        setSelectedLibrary(null);
      }
    };

    initializeLibrary();
  }, [account, library, active, connector]);
  
  return { selectedLibrary };
};

export default useLibrary;
