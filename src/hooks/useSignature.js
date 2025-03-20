
import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import  useLibrary  from './useLibrary';
import { toast } from 'react-toastify';

export const useSignature = () => {
  const { account } = useWeb3React();
  const { selectedLibrary } = useLibrary();

  /**
   * Signs a message with the connected wallet
   */
  const userSign = useCallback(
    async (address) => {
      if (!selectedLibrary || !account) {
        toast.error('Please connect a wallet');
        throw new Error('Wallet not connected');
      }

      if (address.toLowerCase() !== account.toLowerCase()) {
        toast.error('Selected address does not match the connected wallet');
        throw new Error('Address mismatch');
      }

      const signer = selectedLibrary.getSigner();
      const message = `Verify wallet ownership\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      toast.info('Please sign the message in your wallet');
      
      return await signer.signMessage(message);
    },
    [selectedLibrary, account]
  );

  return { userSign };
};