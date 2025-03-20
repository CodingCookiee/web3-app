export const setupNetwork = async () => {
  const provider = window.ethereum;

  if (provider) {
    const chainId = 137;

    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: "Polygon Mainnet",
            nativeCurrency: {
              name: "POL",
              symbol: "POL",
              decimals: 18,
            },
            rpcUrls: ["https://polygon-rpc.com/"], // alternative RPC URL
            blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to connect to Ethereum network", error);
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
};
