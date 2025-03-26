import { ethers } from "ethers";
// i,pon file

// ERC20 Token ABI with burn and mint functions
const ERC20_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function owner() view returns (address)",
  // "function getOwner() view return (address)",
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",

  // Write functions
  "function mint(uint256 amount) returns (bool)",
  "function burn(uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address recipient, uint256 amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

// Get contract address from environment variables
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Initialize contract with provider or signer
const initContract = (providerOrSigner) => {
  return new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, providerOrSigner);
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
  CONTRACT_ADDRESS,
};
