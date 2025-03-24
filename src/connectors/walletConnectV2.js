
import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect-v2';

// These are example values - replace with your own project ID
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const chains = [11155111]; // Sepolia testnet
// const chains = [1, 56, 137]; // Example chains: Ethereum, BSC, Polygon
// const optionalChains = [42161, 10]; // Example optional chains: Arbitrum, Optimism

export const [walletConnectV2, walletConnectV2Hooks] = initializeConnector(
  (actions) => 
    new WalletConnect({
      actions,
      options: {
        projectId,
        chains,
        // optionalChains,
        showQrModal: true,
      },
    })
);