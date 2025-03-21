import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import useLibrary from './useLibrary';
import { toast } from 'react-toastify';
import { ethers } from 'ethers'; 

export const useSignature = () => {
  const { account, active } = useWeb3React();
  const { selectedLibrary, refreshLibrary } = useLibrary();

  /**
   * Signs a message with the connected wallet
   */
  const userSign = useCallback(
    async (message) => {
      console.log("Signing attempt - Active:", active, "Account:", account, "Library:", !!selectedLibrary);
      
      // If active is undefined but we have an account, try to refresh the library
      if (account && selectedLibrary === null) {
        console.log("Account exists but library is null, attempting to refresh library");
        await refreshLibrary();
      }
      
      // Check if we have an account, regardless of active state
      if (!account) {
        console.error("No account available");
        toast.error('No account connected');
        throw new Error('No account connected');
      }
      
      // After refresh, check if library is available
      if (!selectedLibrary) {
        console.error("Library not initialized in useLibrary hook");
        
        // Try to initialize MetaMask directly if it's available
        if (window.ethereum && window.localStorage.getItem("connectorId") === "injected") {
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Make sure ethers is properly imported
            if (typeof ethers !== 'undefined' && ethers.providers) {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();
              
              console.log("Using direct MetaMask connection for signing");
              toast.info('Please sign the message in your wallet');
              
              const signature = await signer.signMessage(message);
              console.log("Signature successful:", signature.substring(0, 20) + "...");
              return signature;
            } else {
              console.error("ethers library is not properly imported");
              throw new Error('ethers library not available');
            }
          } catch (err) {
            console.error("Direct MetaMask signing failed:", err);
            toast.error('Failed to sign with MetaMask');
            throw new Error('Failed to sign with MetaMask');
          }
        }
        
        toast.error('Library not initialized - please reconnect your wallet');
        throw new Error('Library not initialized');
      }

      try {
        console.log("Getting signer from library...");
        const signer = selectedLibrary.getSigner();
        console.log("Signer obtained, requesting signature...");
        toast.info('Please sign the message in your wallet');
        
        const signature = await signer.signMessage(message);
        console.log("Signature successful:", signature.substring(0, 20) + "...");
        return signature;
      } catch (error) {
        console.error('Signing error:', error);
        toast.error('Failed to sign message: ' + (error.message || 'Unknown error'));
        throw error;
      }
    },
    [selectedLibrary, account, active, refreshLibrary]
  );

  return { userSign };
};
