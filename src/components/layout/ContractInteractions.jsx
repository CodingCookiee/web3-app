/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";
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
  approve,
  transfer,
  transferFrom,
  increaseAllowance,
  transferOwnership,
  CONTRACT_ADDRESS,
} from "../../services/contractServices2";
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
  const [approveAmount, setApproveAmount] = useState("");
  const [isSpender, setIsSpender] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isRecipient, setIsRecipient] = useState("");
  const [isSender, setIsSender] = useState("");
  const [isAmountRecipient, setIsAmountRecipient] = useState("");
  const [isTransferAmount, setIsTransferAmount] = useState("");
  const [isAllowanceSpender, setIsAllowanceSpender] = useState("");
  const [isAddedValue, setIsAddedValue] = useState("");
  const [isNewOwner, setIsNewOwner] = useState("");

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
        // console.log("Total Supply:", totalSupply);
        // setTotalSupply(totalSupply);
        if (totalSupply) {
          const formattedTotalSupply = ethers.formatUnits(
            totalSupply,
            decimals
          );
          const trimmedTotalSupply =
            formattedTotalSupply.slice(0, 12) +
            "..." +
            formattedTotalSupply.slice(-3);
          setTotalSupply(trimmedTotalSupply);
        }

        // Get balance
        try {
          const accountBalance = await getBalance(provider, account);
          // console.log("Account Balance:", accountBalance);
          if (accountBalance) {
            setBalance(ethers.formatUnits(accountBalance, decimals));
          }
          setBalance(accountBalance);
        } catch (err) {
          console.error("Error getting balance:", err.message);
          setBalance("0");
        }

        // Get owner
        try {
          const contractOwner = await getOwner(provider);
          // console.log("Contract Owner:", contractOwner);
          // if (contractOwner && contractOwner !== ethers.constants.AddressZero) {
          // }
          if (contractOwner) {
            const formattedOwner =
              contractOwner.slice(0, 10) + "..." + contractOwner.slice(-3);
            setOwner(formattedOwner);
          }
          // setIsOwner(contractOwner.toLowerCase() === account.toLowerCase());
        } catch (err) {
          console.error("Error getting owner:", err.message);
        }

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

      const amount = ethers.parseEther(mintAmount, tokenDecimals);

      await mint(signer, mintAmount);

      // Update balance after minting
      const newBalance = await getBalance(provider, account);
      setBalance(ethers.formatUnits(newBalance, tokenDecimals));

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

      // Convert burnAmount to the appropriate token unit
      const amount = ethers.parseEther(burnAmount, tokenDecimals);

      await burn(signer, amount);

      // Update balance after burning
      const newBalance = await getBalance(provider, account);
      setBalance(ethers.formatUnits(newBalance, tokenDecimals));

      setSuccessMessage(`Successfully burned ${burnAmount} ${tokenSymbol}`);
      setBurnAmount("");
      setIsLoading(false);
    } catch (err) {
      console.error("Burn error:", err);
      setError(`Burn failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!provider || !account || !isSpender || !approveAmount) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("");

      const signer = provider.getSigner();
      const amount = ethers.parseEther(approveAmount, tokenDecimals);
      await approve(signer, isSpender, amount);
      setSuccessMessage(
        `Successfully approved ${approveAmount} ${tokenSymbol} to ${isSpender}`
      );
      setApproveAmount("");
      setIsLoading(false);
    } catch (err) {
      console.error("Error approving token:", err);
      setError(`Approval failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  // handle transfer
  const handleTransfer = async () => {
    if (!provider || !account || !transferAmount || !isRecipient) return;
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("");

      // Checking if the sender has sufficient balance
      const senderBalance = await getBalance(provider, account);
      const amount = ethers.parseEther(transferAmount, tokenDecimals);

      if (senderBalance < amount) {
        setError(
          `Sender doesn't have enough tokens. Balance: ${ethers.formatUnits(
            senderBalance,
            tokenDecimals
          )} ${tokenSymbol}`
        );
        setIsLoading(false);
        return;
      }

      const signer = provider.getSigner();

      await transfer(signer, isRecipient, amount);
      setSuccessMessage(
        `Successfully transferred ${transferAmount} ${tokenSymbol} to ${isRecipient}`
      );
      setTransferAmount("");
      setIsLoading(false);
      setIsRecipient("");
    } catch (err) {
      console.error("Error transferring token:", err);
      setError(`Transfer failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  // handle transfer
  const handleTransferFrom = async () => {
    if (
      !provider ||
      !account ||
      !isSender ||
      !isAmountRecipient ||
      !isTransferAmount
    )
      return;
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("");

      // Checking if the sender has sufficient balance
      const senderBalance = await getBalance(provider, isSender);
      const amount = ethers.parseEther(isTransferAmount, tokenDecimals);

      if (senderBalance < amount) {
        setError(
          `Sender doesn't have enough tokens. Balance: ${ethers.formatUnits(
            senderBalance,
            tokenDecimals
          )} ${tokenSymbol}`
        );
        setIsLoading(false);
        return;
      }

      const signer = provider.getSigner();
      await transferFrom(signer, isSender, isAmountRecipient, amount);
      setSuccessMessage(
        `Successfully transferred ${isTransferAmount} ${tokenSymbol} to ${isAmountRecipient}`
      );
      setIsAmountRecipient("");
      setIsSender("");
      setIsAmountRecipient("");
      setIsLoading(false);
    } catch (err) {
      console.error("Error transferring token:", err);
      setError(`Transfer failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  // handle transfer
  const handleIncreaseAllowance = async () => {
    if (!provider || !account || !isAllowanceSpender || !isAddedValue) return;
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("");
      const signer = provider.getSigner();
      const addedValue = ethers.parseEther(isAddedValue, tokenDecimals);
      await increaseAllowance(signer, isAllowanceSpender, addedValue);
      setSuccessMessage(
        `Successfully increased allowance of ${addedValue} ${tokenSymbol} for ${isAllowanceSpender}`
      );
      setIsAddedValue("");
      setIsAllowanceSpender("");
      setIsLoading(false);
    } catch (err) {
      console.error("Error increasing allowance:", err);
      setError(`Allowance Increasing Failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  // handle transfer
  const handleTranFerOwnership = async () => {
    if (!provider || !account || !isNewOwner) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("");
      const signer = provider.getSigner();
      await transferOwnership(signer, isNewOwner);
      setSuccessMessage(`Successfully transferred ownership to ${isNewOwner}`);
      setIsNewOwner("");
      setIsLoading(false);
    } catch (err) {
      console.error("Error transferring ownership:", err);
      setError(`Ownership Transfer Failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Handle adding token to MetaMask
  const handleAddTokenToWallet = async () => {
    if (!window.ethereum || !account) {
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
      <div className="w-full h-full flex flex-col items-center justify-center gap-12">
        <Text variant="h3" color="secondary" align="center">
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
      <Text variant="h1">{tokenSymbol.toUpperCase()} Token Interaction</Text>

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
              Total Supply: {isTotalSupply} {tokenSymbol}
            </Text>

            <Text variant="h4" color="secondary">
              Contract Owner: {owner}
            </Text>
            <Text variant="h4" color="secondary">
              Contract Address:{" "}
              {CONTRACT_ADDRESS.slice(0, 10) +
                "..." +
                CONTRACT_ADDRESS.slice(-3)}
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
          type="number"
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
          type="number"
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

      {/* Approve Section */}
      <div className="w-full flex flex-col items-start gap-2.5">
        <Text variant="h3" color="secondary" weight="bold" className="mb-2">
          Approve
        </Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={isSpender}
          onChange={(e) => setIsSpender(e.target.value)}
          placeholder="Spender"
          disabled={isLoading}
        />
        <input
          type="number"
          className="w-full p-2 rounded-sm"
          required
          value={approveAmount}
          onChange={(e) => setApproveAmount(e.target.value)}
          placeholder="Amount"
          disabled={isLoading}
        />
        <Button
          onClick={handleApprove}
          disabled={isLoading || !isSpender || !approveAmount}
        >
          Approve
        </Button>
      </div>

      {/* Transfer Section */}
      <div className="w-full flex flex-col items-start gap-2.5">
        <Text variant="h3" color="secondary" weight="bold" className="mb-2">
          Transfer
        </Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={isRecipient}
          onChange={(e) => setIsRecipient(e.target.value)}
          placeholder="Recipient"
          disabled={isLoading}
        />
        <input
          type="number"
          className="w-full p-2 rounded-sm"
          required
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="Amount"
          disabled={isLoading}
        />
        <Button
          onClick={handleTransfer}
          disabled={isLoading || !isRecipient || !transferAmount}
        >
          Transfer
        </Button>
      </div>

      {/* TransferFrom Section */}
      <div className="w-full flex flex-col items-start gap-2.5">
        <Text variant="h3" color="secondary" weight="bold" className="mb-2">
          Transfer From
        </Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={isSender}
          onChange={(e) => setIsSender(e.target.value)}
          placeholder="Sender"
          disabled={isLoading}
        />
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={isAmountRecipient}
          onChange={(e) => setIsAmountRecipient(e.target.value)}
          placeholder="Recipient"
          disabled={isLoading}
        />
        <input
          type="number"
          className="w-full p-2 rounded-sm"
          required
          value={isTransferAmount}
          onChange={(e) => setIsTransferAmount(e.target.value)}
          placeholder="Amount"
          disabled={isLoading}
        />
        <Button
          onClick={handleTransferFrom}
          disabled={
            !provider ||
            !account ||
            !isSender ||
            !isAmountRecipient ||
            !isTransferAmount
          }
        >
          Transfer From
        </Button>
      </div>

      {/* Increase Allowance Section */}
      <div className="w-full flex flex-col items-start gap-2.5">
        <Text variant="h3" color="secondary" weight="bold" className="mb-2">
          Increase Allowance
        </Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={isAllowanceSpender}
          onChange={(e) => setIsAllowanceSpender(e.target.value)}
          placeholder="Spender"
          disabled={isLoading}
        />

        <input
          type="number"
          className="w-full p-2 rounded-sm"
          required
          value={isAddedValue}
          onChange={(e) => setIsAddedValue(e.target.value)}
          placeholder="Add Value"
          disabled={isLoading}
        />
        <Button
          onClick={handleIncreaseAllowance}
          disabled={
            !provider || !account || !isAddedValue || !isAllowanceSpender
          }
        >
          Increase Allowance
        </Button>
      </div>

      {/* Transfer OwnerShip Section  */}
      <div className="w-full flex flex-col items-start gap-2.5">
        <Text variant="h3" color="secondary" weight="bold" className="mb-2">
          Transfer OwnerShip
        </Text>
        <input
          type="text"
          className="w-full p-2 rounded-sm"
          required
          value={isNewOwner}
          onChange={(e) => setIsNewOwner(e.target.value)}
          placeholder="New Owner's Address"
          disabled={isLoading}
        />
        <Button
          onClick={handleTranFerOwnership}
          disabled={!provider || !account || !isNewOwner}
        >
          Transfer OwnerShip
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
