import { ethers } from "ethers";
import abi from '../abi.json'


// Get contract address from environment variables
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Initialize contract with provider or signer
const initContract = (providerOrSigner) => {
  return new ethers.Contract(CONTRACT_ADDRESS, abi, providerOrSigner);
};

// Read functions
const getTokenName = async (provider) => {
  const contract = initContract(provider);
  try {
    return await contract.name();
  } catch (error) {
    console.error("Error reading token name:", error);
    throw error;
  }
};

const getTokenSymbol = async (provider) => {
  const contract = initContract(provider);
  try {
    return await contract.symbol();
  } catch (error) {
    console.error("Error reading token symbol:", error);
    throw error;
  }
};

const getTokenDecimals = async (provider) => {
  const contract = initContract(provider);
  try {
    return await contract.decimals();
  } catch (error) {
    console.error("Error reading token decimals:", error);
    throw error;
  }
};

const getBalance = async (provider, address) => {
  const contract = initContract(provider);
  try {
    return await contract.balanceOf(address);
  } catch (error) {
    console.error("Error reading balance:", error);
    throw error;
  }
};

const getOwner = async (provider) => {
  const contract = initContract(provider);
  try {
    return await contract.owner();
  } catch (error) {
    console.error("Error reading token owner:", error);
    throw error;
  }
};

const getTotalSupply = async (provider) => {
  const contract = initContract(provider);
  try {
    return await contract.totalSupply();
  } catch (error) {
    console.error("Error reading total supply:", error);
    throw error;
  }
};

const getOwnerOf = async (provider) => {
  const contract = initContract(provider);
  try {
    return await contract.getOwner();
  } catch (error) {
    console.error("Error reading owner of:", error);
    throw error;
  }
};
// Write functions
const mint = async (signer, amount) => {
  const contract = initContract(signer);
  try {
    const tx = await contract.mint(amount);
    return await tx.wait();
  } catch (error) {
    console.error("Error minting tokens:", error);
    throw error;
  }
};

const burn = async (signer, amount) => {
  const contract = initContract(signer);
  try {
    const tx = await contract.burn(amount);
    return await tx.wait();
  } catch (error) {
    console.error("Error burning tokens:", error);
    throw error;
  }
};

const approve = async (signer, spender, amount) => {
  const contract = initContract(signer);
  try {
    const tx = await contract.approve(spender, amount);
    return await tx.wait();
  } catch (error) {
    console.error("Error approving tokens:", error);
    throw error;
  }
};

const transfer = async (signer, recipient, amount) => {
  const contract = initContract(signer);
  try {
    const tx = await contract.transfer(recipient, amount);
    return await tx.wait();
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  }
};

const transferFrom = async (signer, sender, recipient, amount) => {
  const contract = initContract(signer);
  try {
    const tx = await contract.transferFrom(sender, recipient, amount);
    return await tx.wait();
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  }
};

const increaseAllowance = async (signer, spender, addedValue) => {
  const contract = initContract(signer);
  try {
    const tx = await contract.increaseAllowance(spender, addedValue);
    return await tx.wait();
  } catch (error) {
    console.error("Error increasing allowance:", error);
    throw error;
  }
};

const transferOwnership = async (signer, newOwner) => {
  const contract = initContract(signer);

  try {
    const tx = await contract.transferOwnership(newOwner);
    return await tx.wait();
  } catch (error) {
    console.error("Error transferring ownership:", error);
    throw error;
  }
};

export {
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getBalance,
  getOwner,
  getTotalSupply,
  getOwnerOf,
  mint,
  burn,
  approve,
  transfer,
  transferFrom,
  increaseAllowance,
  transferOwnership,
  CONTRACT_ADDRESS,
};
