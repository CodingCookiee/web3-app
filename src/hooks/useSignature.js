import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import useLibrary from './useLibrary';
import { toast } from 'react-toastify';

export const useSignature = () => {
  const { account, active } = useWeb3React();
  const { selectedLibrary } = useLibrary();

  /**
   * Signs a message with the connected wallet
   */
  const userSign = useCallback(
    async (message) => {
      if (!active) {
        toast.error('Please connect a wallet');
        throw new Error('Wallet not connected');
      }
      
      if (!selectedLibrary) {
        toast.error('Library not initialized');
        throw new Error('Library not initialized');
      }

      if (!account) {
        toast.error('No account connected');
        throw new Error('No account connected');
      }

      try {
        const signer = selectedLibrary.getSigner();
        toast.info('Please sign the message in your wallet');
        
        return await signer.signMessage(message);
      } catch (error) {
        console.error('Signing error:', error);
        toast.error('Failed to sign message: ' + (error.message || 'Unknown error'));
        throw error;
      }
    },
    [selectedLibrary, account, active]
  );

  return { userSign };
};
