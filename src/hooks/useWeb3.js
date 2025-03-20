import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import Web3 from 'web3';

// create and returns a new instance of Web3

export const useWeb3 = () => {
    const { provider } = useWeb3React();

    return useMemo(() => {
        if (!provider) return new Web3('http://localhost:8545'); // Replace with your local Ethereum node URL

        return new Web3(provider);

        }, [provider]);
};


