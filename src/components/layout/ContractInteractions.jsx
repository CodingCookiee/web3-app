/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Text from "../ui/text";
import { Button } from "../ui/button";
import { Loading } from "../ui/loader";
import {
  getTotalSupply,
  getOwnerOf,
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getBalance,
  getOwner,
  mint,
  burn,
  CONTRACT_ADDRESS,
} from "../../services/contractService";
import { registerToken } from "../../lib/wallet";

const ContractInteraction = () => {
  const { account, provider, chainId } = useWeb3React();

  // State for token info
  const [tokenName, setTokenName] = useState("USDT");
  const [tokenSymbol, setTokenSymbol] = useState("USDT");
  const [tokenDecimals, setTokenDecimals] = useState(6);
  const [balance, setBalance] = useState("0");
  const [owner, setOwner] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isTotalSupply, setTotalSupply] = useState();
  const [isOwnerOf, setIsOwnerOf] = useState(false);

  // State for user inputs
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Load token info when provider and account are available
  useEffect(() => {
    const loadTokenInfo = async () => {
      if (!provider || !account) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get token info with proper error handling
        const name = await getTokenName(provider);
        if (name) setTokenName(name);

        const symbol = await getTokenSymbol(provider);
        if (symbol) setTokenSymbol(symbol);

        const decimals = await getTokenDecimals(provider);
        if (decimals !== undefined) setTokenDecimals(decimals);

        // Get total supply
        const totalSupply = await getTotalSupply(provider);
        console.log("Total Supply:", totalSupply);
        setTotalSupply(totalSupply);
        // if (totalSupply) setTotalSupply(ethers.utils.formatUnits(totalSupply, decimals));

        // Get balance
        try {
          const accountBalance = await getBalance(provider, account);
          console.log("Account Balance:", accountBalance);
          if (accountBalance) {
            setBalance(ethers.utils.formatUnits(accountBalance, decimals));
          }
        } catch (err) {
          console.error("Error getting balance:", err.message);
          setBalance("0");
        }

        // Get owner
        try {
          const contractOwner = await getOwner(provider);
          console.log("Contract Owner:", contractOwner);
          // if (contractOwner && contractOwner !== ethers.constants.AddressZero) {
          // }
          setOwner(contractOwner);
          // setIsOwner(contractOwner.toLowerCase() === account.toLowerCase());
        } catch (err) {
          console.error("Error getting owner:", err.message);
        }

        // getOwnerof 
        const ownerOf = await getOwnerOf(provider, account);
        console.log("Owner of:", ownerOf);
        if(ownerOf) setIsOwnerOf(true);


        setIsLoading(false);
      } catch (err) {
        console.error("Error loading token info:", err);
        setError("Failed to load token information");
        setIsLoading(false);
      }
    };

    loadTokenInfo();
  }, [provider, account]);

  // Handle mint (available to all users now)
  const handleMint = async () => {
    if (!provider || !account || !mintAmount) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("");

      const signer = provider.getSigner();
      const amount = ethers.utils.parseUnits(mintAmount, tokenDecimals);

      await mint(signer, amount);

      // Update balance after minting
      const newBalance = await getBalance(provider, account);
      setBalance(ethers.utils.formatUnits(newBalance, tokenDecimals));

      setSuccessMessage(`Successfully minted ${mintAmount} ${tokenSymbol}`);
      setMintAmount("");
      setIsLoading(false);
    } catch (err) {
      console.error("Mint error:", err);
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
      setSuccessMessage("");

      const signer = provider.getSigner();
      const amount = ethers.utils.parseUnits(burnAmount, tokenDecimals);

      await burn(signer, amount);

      // Update balance after burning
      const newBalance = await getBalance(provider, account);
      setBalance(ethers.utils.formatUnits(newBalance, tokenDecimals));

      setSuccessMessage(`Successfully burned ${burnAmount} ${tokenSymbol}`);
      setBurnAmount("");
      setIsLoading(false);
    } catch (err) {
      console.error("Burn error:", err);
      setError(`Burn failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Handle adding token to MetaMask
  const handleAddTokenToWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected");
      return;
    }

    try {
      setIsLoading(true);
      await registerToken(
        CONTRACT_ADDRESS,
        tokenSymbol,
        tokenDecimals,
        null // No token image for now
      );
      setSuccessMessage("Token added to wallet successfully");
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding token to wallet:", err);
      setError("Failed to add token to wallet");
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="w-full h-full flex flex-col items-center gap-12">
        <Text variant="h3" color="secondary">
          Please connect your wallet first for contract interaction
        </Text>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center gap-12
    bg-gray-200 border border-neutral-400 shadow-md rounded-lg px-10 py-10"
    >
      <Text variant="h1">{tokenSymbol} Token Interaction</Text>

      {/* Token Info Section */}
      <div className="w-full flex flex-col items-start gap-2.5">
        <Text variant="h3" color="secondary" weight="bold" className="mb-2">
          Token Information
        </Text>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            <Text variant="h4" color="secondary">
              Name: {tokenName}
            </Text>
            <Text variant="h4" color="secondary">
              Symbol: {tokenSymbol}
            </Text>
            <Text variant="h4" color="secondary">
              Decimals: {tokenDecimals}
            </Text>
            <Text variant="h4" color="secondary">
              Your Balance: {balance} {tokenSymbol}
            </Text>
            <Text variant="h4" color="secondary">
              Contract Owner: {owner }
            </Text>
            <Text variant='h4' color="secondary">
              Owner Address: {isOwnerOf? account : "N/A"}
            </Text>
            <Text variant="h4" color="secondary">
              Total Supply: {isTotalSupply} {tokenSymbol}
            </Text>
            <Text variant="h4" color="secondary">
              Contract Address: {CONTRACT_ADDRESS}
            </Text>
            <Button
              className="mt-2"
              onClick={handleAddTokenToWallet}
              disabled={isLoading}
            >
              Add Token To MetaMask
            </Button>
          </>
        )}
      </div>

      {/* Mint Section - Now available to all users */}
      <div className="w-full flex flex-col items-start gap-2.5">
        <Text variant="h3" color="secondary" weight="bold" className="mb-2">
          Mint Tokens
        </Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          placeholder="Amount to Mint"
          disabled={isLoading}
        />
        <Button onClick={handleMint} disabled={isLoading || !mintAmount}>
          Mint
        </Button>
      </div>

      {/* Burn Section */}
      <div className="w-full flex flex-col items-start gap-2.5">
        <Text variant="h3" color="secondary" weight="bold" className="mb-2">
          Burn Tokens
        </Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={burnAmount}
          onChange={(e) => setBurnAmount(e.target.value)}
          placeholder="Amount to Burn"
          disabled={isLoading}
        />
        <Button onClick={handleBurn} disabled={isLoading || !burnAmount}>
          Burn
        </Button>
      </div>

      {error && (
        <div className="w-full h-full flex items-center justify-center">
          <Text variant="error" color="error">
            {error}
          </Text>
        </div>
      )}
      {successMessage && (
        <div className="w-full h-full flex items-center justify-center">
          <Text variant="success" color="success">
            {successMessage}
          </Text>
        </div>
      )}
      {/* Loading indicator */}
      {isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default ContractInteraction;
