export const setupNetwork = async () => {
  const provider = window.ethereum;

  if (provider) {
    // Sepolia testnet chain ID based on your env variables
    const chainId = parseInt(import.meta.env.VITE_CHAIN_ID, 16);

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [import.meta.env.VITE_RPC_URL],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Failed to add Sepolia network", addError);
          return false;
        }
      }
      console.error("Failed to switch to Sepolia network", switchError);
      return false;
    }
  } else {
    console.error("No Ethereum provider detected");
    return false;
  }
};

export const registerToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage
) => {
  if (!window.ethereum) {
    throw new Error("Ethereum provider not found");
  }

  try {
    const tokenAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });
    console.log("ERC20 token added:", tokenAdded);
    return tokenAdded;
  } catch (error) {
    console.error("Error adding token to wallet:", error);
    throw error;
  }
};