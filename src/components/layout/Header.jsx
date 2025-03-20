import React from "react";
import ConnectButton from "./ConnectButton";
import WalletInfo from "./WalletInfo";
import { useWeb3React } from "@web3-react/core";
import Text from "../ui/text";

function Header() {
  const { isActive } = useWeb3React();

  return (
    <header className="app-header flex flex-col items-center gap-12">
      <div
        className="header-top flex flex-col items-center
       justify-center gap-5 bg-neutral-200 border
        border-neutral-300 rounded-lg px-10 py-10"
      >
        <Text variant="h1" color="default" weight="bold">
          Welcome to Web3 Wallet
        </Text>
        <Text variant="h4" color="secondary" weight="normal">
          Connect your wallet to get started
        </Text>
      </div>

      <div className="header-bottom flex flex-col items-center gap-5">
        {isActive && <WalletInfo />}
        <ConnectButton />
      </div>
    </header>
  );
}

export default Header;
