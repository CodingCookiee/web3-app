import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import Text from '../ui/text';
import { Button } from '../ui/button';
import { Loading } from '../ui/loader';
import {
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getBalance,
  getOwner,
  approve,
  transfer,
  transferFrom,
  mint,
  burn
} from '../../services/contractService';

const ContractInteraction = () => {
  const { account, provider, chainId } = useWeb3React();
  
  // State for token info
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const [balance, setBalance] = useState('0');
  const [owner, setOwner] = useState('');
  
  // State for user inputs
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [spenderAddress, setSpenderAddress] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load token info when provider and account are available
  useEffect(() => {
    const loadTokenInfo = async () => {
      if (!provider || !account) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const name = await getTokenName(provider);
        const symbol = await getTokenSymbol(provider);
        const decimals = await getTokenDecimals(provider);
        const accountBalance = await getBalance(provider, account);
        const contractOwner = await getOwner(provider);
        
        setTokenName(name);
        setTokenSymbol(symbol);
        setTokenDecimals(decimals);
        setBalance(ethers.utils.formatUnits(accountBalance, decimals));
        setOwner(contractOwner);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading token info:', err);
        setError('Failed to load token information');
        setIsLoading(false);
      }
    };
    
    loadTokenInfo();
  }, [provider, account]);
  
  // Handle transfer
  const handleTransfer = async () => {
    if (!provider || !account || !recipientAddress || !transferAmount) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const signer = provider.getSigner();
      const amount = ethers.utils.parseUnits(transferAmount, tokenDecimals);
      
      await transfer(signer, recipientAddress, amount);
      
      // Update balance after transfer
      const newBalance = await getBalance(provider, account);
      setBalance(ethers.utils.formatUnits(newBalance, tokenDecimals));
      
      setSuccessMessage(`Successfully transferred ${transferAmount} ${tokenSymbol} to ${recipientAddress}`);
      setTransferAmount('');
      setRecipientAddress('');
      setIsLoading(false);
    } catch (err) {
      console.error('Transfer error:', err);
      setError(`Transfer failed: ${err.message}`);
      setIsLoading(false);
    }
  };
  
  // Handle approve
  const handleApprove = async () => {
    if (!provider || !account || !spenderAddress || !approveAmount) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const signer = provider.getSigner();
      const amount = ethers.utils.parseUnits(approveAmount, tokenDecimals);
      
      await approve(signer, spenderAddress, amount);
      
      setSuccessMessage(`Successfully approved ${approveAmount} ${tokenSymbol} for ${spenderAddress}`);
      setApproveAmount('');
      setSpenderAddress('');
      setIsLoading(false);
    } catch (err) {
      console.error('Approve error:', err);
      setError(`Approve failed: ${err.message}`);
      setIsLoading(false);
    }
  };
  
  // Handle mint (only for owner)
  const handleMint = async () => {
    if (!provider || !account || !mintAmount) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const signer = provider.getSigner();
      const amount = ethers.utils.parseUnits(mintAmount, tokenDecimals);
      
      await mint(signer, amount);
      
      // Update balance after minting
      const newBalance = await getBalance(provider, account);
      setBalance(ethers.utils.formatUnits(newBalance, tokenDecimals));
      
      setSuccessMessage(`Successfully minted ${mintAmount} ${tokenSymbol}`);
      setMintAmount('');
      setIsLoading(false);
    } catch (err) {
      console.error('Mint error:', err);
      setError(`Mint failed: ${err.message}`);
      setIsLoading(false);
    }
  };
  
  // Handle burn
  const handleBurn = async () => {
    if (!provider || !account || !burnAmount) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const signer = provider.getSigner();
      const amount = ethers.utils.parseUnits(burnAmount, tokenDecimals);
      
      await burn(signer, amount);
      
      // Update balance after burning
      const newBalance = await getBalance(provider, account);
      setBalance(ethers.utils.formatUnits(newBalance, tokenDecimals));
      
      setSuccessMessage(`Successfully burned ${burnAmount} ${tokenSymbol}`);
      setBurnAmount('');
      setIsLoading(false);
    } catch (err) {
      console.error('Burn error:', err);
      setError(`Burn failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className='w-full h-full flex flex-col items-center gap-12'>
        <Text variant='h3' color='secondary'>Please connect your wallet first for contract interaction</Text>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col items-center gap-12
    bg-gray-200 border border-neutral-400 shadow-md rounded-lg px-10 py-10'>
      <Text variant='h1'>USDT Token Interaction</Text>
      
      {error && <Text variant='error' color='error'>{error}</Text>}
      {successMessage && <Text variant='success' color='success'>{successMessage}</Text>}
      
      {/* Token Info Section */}
      <div className='w-full flex flex-col items-start gap-2.5'>
        <Text variant='h3' color='secondary' weight='bold' className='mb-2'>Token Information</Text>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Text variant='h4' color='secondary'>Name: {tokenName}</Text>
            <Text variant='h4' color='secondary'>Symbol: {tokenSymbol}</Text>
            <Text variant='h4' color='secondary'>Decimals: {tokenDecimals}</Text>
            <Text variant='h4' color='secondary'>Your Balance: {balance} {tokenSymbol}</Text>
            <Text variant='h4' color='secondary'>Contract Owner: {owner}</Text>
          </>
        )}
      </div>
      
      {/* Transfer Section */}
      {/* <div className='w-full flex flex-col items-start gap-2.5'>
        <Text variant='h3' color='secondary' weight='bold' className='mb-2'>Transfer Tokens</Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="Recipient Address"
          disabled={isLoading}
        />
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="Amount to Transfer"
          disabled={isLoading}
        />
        <Button 
          onClick={handleTransfer} 
          disabled={isLoading || !recipientAddress || !transferAmount}
        >
          Transfer
        </Button>
      </div> */}
      
      {/* Approve Section */}
      {/* <div className='w-full flex flex-col items-start gap-2.5'>
        <Text variant='h3' color='secondary' weight='bold' className='mb-2'>Approve Spender</Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={spenderAddress}
          onChange={(e) => setSpenderAddress(e.target.value)}
          placeholder="Spender Address"
          disabled={isLoading}
        />
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={approveAmount}
          onChange={(e) => setApproveAmount(e.target.value)}
          placeholder="Amount to Approve"
          disabled={isLoading}
        />
        <Button 
          onClick={handleApprove} 
          disabled={isLoading || !spenderAddress || !approveAmount}
        >
          Approve
        </Button>
      </div> */}
      
      {/* Owner Functions Section - Only show if user is the owner */}
      {account && owner && account.toLowerCase() === owner.toLowerCase() && (
        <>
          {/* Mint Section */}
          <div className='w-full flex flex-col items-start gap-2.5'>
            <Text variant='h3' color='secondary' weight='bold' className='mb-2'>Mint Tokens (Owner Only)</Text>
            <input
              type="text"
              className="w-full p-2 rounded-sm"
              required
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="Amount to Mint"
              disabled={isLoading}
            />
            <Button 
              onClick={handleMint} 
              disabled={isLoading || !mintAmount}
            >
              Mint
            </Button>
          </div>
        </>
      )}
      
      {/* Burn Section */}
      <div className='w-full flex flex-col items-start gap-2.5'>
        <Text variant='h3' color='secondary' weight='bold' className='mb-2'>Burn Tokens</Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={burnAmount}
          onChange={(e) => setBurnAmount(e.target.value)}
          placeholder="Amount to Burn"
          disabled={isLoading}
        />
        <Button 
          onClick={handleBurn} 
          disabled={isLoading || !burnAmount}
        >
          Burn
        </Button>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className='w-full flex justify-center items-center'>
          <Loading />
          <Text variant='body1' color='secondary' className='ml-2'>Processing transaction...</Text>
        </div>
      )}
    </div>
  );
};

export default ContractInteraction;
