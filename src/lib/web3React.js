
import { Web3Provider } from '@ethersproject/providers';
import { metaMask } from '../connectors/metamask';
import { walletConnectV2 } from '../connectors/walletConnectV2';

// Get library for ethers
export function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

// Get library specifically for signing
export function getLibraryForSign(providerOrAccount, provider) {
  if (provider) {
    // For injected providers like MetaMask
    return new Web3Provider(provider);
  } else if (providerOrAccount && typeof providerOrAccount !== 'string') {
    // For non-injected providers (like WalletConnect)
    return new Web3Provider(providerOrAccount);
  }
  return null;
}

// Mapping of connector names to connectors
export const connectorsByName = {
  injected: metaMask,
  walletconnect: walletConnectV2
};

// Constants for connector names
export const ConnectorNames = {
  Injected: 'injected',
  WalletConnect: 'walletconnect'
};