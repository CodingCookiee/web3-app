import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useMemo, useState, useEffect, useRef } from "react";
import { getWeb3NoAccount } from "../lib/web3";
// create and returns a new instance of Web3

export const useWeb3 = () => {
  const { provider, connector } = useWeb3React();
  const refETH = useRef();
  const [web3, setWeb3] = useState(
    provider ? new Web3(provider) : getWeb3NoAccount()
  );
  useEffect(() => {
    if (provider !== refETH.current) {
      setWeb3(provider ? new Web3(provider) : getWeb3NoAccount());
      refETH.current = provider;
    }
  }, [provider, connector, web3]);
  return useMemo(() => {
    return web3;
  }, [web3]);
};


