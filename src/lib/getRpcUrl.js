// src/lib/getRpcUrl.js
import { random } from 'lodash';

// Array of available nodes to connect to
export const nodes = [
  import.meta.env.VITE_NODE || 'https://eth-sepolia.public.blastapi.io',
  import.meta.env.VITE_NODE_1 || 'https://eth-sepolia.public.blastapi.io',
  import.meta.env.VITE_NODE_2 || 'https://eth-sepolia.public.blastapi.io',
  import.meta.env.VITE_NODE_3 || 'https://eth-sepolia.public.blastapi.io'
];

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex];
};

export default getNodeUrl;