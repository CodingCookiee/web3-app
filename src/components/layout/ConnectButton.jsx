import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import  Text  from "../ui/text";
import { useWeb3React } from "@web3-react/core";
import { metaMask } from "../../connectors/metaMask";
import { walletConnectV2 } from "../../connectors/walletConnectV2";

function ConnectButton() {
  const { account, isActive } = useWeb3React();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Reset error when account changes
  useEffect(() => {
    setConnectionError(null);
  }, [account]);

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      await metaMask.activate();
    } catch (error) {
      console.error("MetaMask connection error:", error);
      setConnectionError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWalletConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      await walletConnectV2.activate();
    } catch (error) {
      console.error("WalletConnect error:", error);
      setConnectionError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (metaMask.isActive) await metaMask.deactivate();
      if (walletConnectV2.isActive) await walletConnectV2.deactivate();
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  if (isActive && account) {
    return (
      <Button
        variant="destructive"
        onClick={disconnect}
        className="disconnect-button cursor-pointer py-5"
      >
        Disconnect {account.substring(0, 6)}...
        {account.substring(account.length - 4)}
      </Button>
    );
  }

  return (
    <div className="connect-wallet-container flex flex-col items-center gap-5">
      <div className="flex items-center gap-2">

      <Button
        variant="default"
        onClick={connectMetaMask}
        disabled={isConnecting}
        className="connect-button cursor-pointer py-5"
        >
        {isConnecting ? "Connecting..." : "Connect MetaMask"}
      </Button>

      <Button
        variant="default"
        onClick={connectWalletConnect}
        disabled={isConnecting}
        className="connect-button cursor-pointer py-5"
        >
        {isConnecting ? "Connecting..." : "Connect WalletConnect"}
      </Button>
      </div>

      {connectionError && (
        <Text 
        variant="error"
        color="error"
        align="center"
        size="lg"
        weight="normal"
        className="connection-error">{connectionError}</Text>
      )}
    </div>
  );
}

export default ConnectButton;
