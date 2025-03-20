
import Web3 from 'web3';
import getRpcUrl from './getRpcUrl';

const RPC_URL = getRpcUrl();

// Check if RPC_URL is defined before creating the provider
const getWeb3NoAccount = () => {
  if (!RPC_URL) {
    console.error('RPC URL is undefined. Check your configuration.');
    return null;
  }
  
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 });
  return new Web3(httpProvider);
};

const web3NoAccount = RPC_URL ? getWeb3NoAccount() : null;

export { getWeb3NoAccount };
export default web3NoAccount;