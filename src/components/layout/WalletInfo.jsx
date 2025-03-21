import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useWeb3 } from '../../hooks/useWeb3';
import { useRefresh } from '../../hooks/useRefresh';
import { useSignature } from '../../hooks/useSignature';
import { Button } from '../ui/button';
import Text from '../ui/text';

function WalletInfo() {
  const { account, chainId, isActive } = useWeb3React();
  const web3 = useWeb3();
  const { fastRefresh } = useRefresh();
  const { userSign } = useSignature();
  
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState('');
  const [signatureResult, setSignatureResult] = useState(null);

  // Map chain IDs to network names
  useEffect(() => {
    if (!chainId) return;
    
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      42: 'Kovan Testnet',
      56: 'Binance Smart Chain',
      137: 'Polygon Mainnet',
      // Add more networks as needed
    };
    
    setNetwork(networks[chainId] || `Chain ID: ${chainId}`);
  }, [chainId]);

  // Fetch wallet balance
  useEffect(() => {
    const getBalance = async () => {
      if (isActive && account && web3) {
        try {
          const balanceWei = await web3.eth.getBalance(account);
          const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
          setBalance(parseFloat(balanceEth).toFixed(4));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance('Error');
        }
      }
    };

    getBalance();
  }, [isActive, account, web3, fastRefresh]);

  const handleSignMessage = async () => {
    if (!userSign || !account) return;
    
    try {
      const message = `Hello from Web3 Wallet! Signing with account: ${account}`;
      const signature = await userSign(message);
      setSignatureResult({
        success: true,
        message,
        signature
      });
    } catch (error) {
      console.error('Error signing message:', error);
      setSignatureResult({
        success: false,
        error: error.message
      });
    }
  };

  if (!isActive || !account) {
    return <div className="wallet-info-container p-4">Wallet not connected</div>;
  }

  return (
    <div className="wallet-info-container w-full h-full p-4 bg-white rounded-lg shadow-md">
      <div className="grid gap-3">
        <div className="wallet-info-item">
          <Text variant="small" color="secondary">Account:</Text>
          <Text variant="body">
            {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </Text>
        </div>
        
        <div className="wallet-info-item w-full ">
          <Text variant="small" color="secondary">Network:</Text>
          <Text variant="body">{network}</Text>
        </div>
        
        <div className="wallet-info-item">
          <Text variant="small" color="secondary">Balance:</Text>
          <Text variant="body">{balance} ETH</Text>
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full bg-indigo-500 text-white hover:text-amber-50 hover:bg-indigo-600"
            onClick={handleSignMessage}
          >
            Sign Message
          </Button>
        </div>
        
        {signatureResult && (
          <div className="mt-4 w-full p-3 bg-gray-100 rounded-md">
            <Text variant="small" color="secondary">Signature Result:</Text>
            {signatureResult.success ? (
              <>
                <Text variant="small" className="break-all mt-1">
                  <strong>Message:</strong> {signatureResult.message}
                </Text>
                <Text variant="small" className="break-all mt-1">
                  <strong>Signature:</strong> {signatureResult.signature.substring(0, 30)}...
                </Text>
              </>
            ) : (
              <Text variant="small" color='error'  className="mt-1">
                Error: {signatureResult.error}
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletInfo;