
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useWeb3 } from '../../hooks/useWeb3.js';
import { useRefresh } from '../../hooks/useRefresh';

function WalletInfo() {
  const { account, chainId, isActive } = useWeb3React();
  const web3 = useWeb3();
  const { fastRefresh } = useRefresh();
  
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState('');

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

  if (!isActive || !account) {
    return <div className="wallet-info-container">Wallet not connected</div>;
  }

  return (
    <div className="wallet-info-container">
      <div className="wallet-info-item">
        <span className="label">Account:</span>
        <span className="value">
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </span>
      </div>
      
      <div className="wallet-info-item">
        <span className="label">Network:</span>
        <span className="value">{network}</span>
      </div>
      
      <div className="wallet-info-item">
        <span className="label">Balance:</span>
        <span className="value">{balance} ETH</span>
      </div>
    </div>
  );
}

export default WalletInfo;