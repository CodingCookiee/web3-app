import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useMemo, useState, useEffect, useRef } from "react";
import { getWeb3NoAccount } from "../lib/web3";

export const useWeb3 = () => {
  const { provider, connector, active, account } = useWeb3React();
  const refETH = useRef();
  const [web3, setWeb3] = useState(null);
  
  useEffect(() => {
    const initWeb3 = async () => {
      // Only create Web3 instance if we're connected
      if (active && account && provider) {
        try {
          const newWeb3 = new Web3(provider);
          setWeb3(newWeb3);
          refETH.current = provider;
        } catch (error) {
          console.error("Error initializing Web3:", error);
          setWeb3(getWeb3NoAccount());
        }
      } else {
        // Fallback to RPC provider
        setWeb3(getWeb3NoAccount());
      }
    };
    
    initWeb3();
  }, [provider, connector, active, account]);

  return useMemo(() => {
    return web3;
  }, [web3]);
};
