import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { getLibraryForSign } from "../lib/web3React";
import { connectorsByName } from "../lib/web3React";

const useLibrary = () => {
  const { account, library } = useWeb3React();
  const [selectedLibrary, setSelectedLibrary] = useState(null);

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");

    let libraryToUse = null;

    if (connectorId === "injected" && account && library?.provider) {
      libraryToUse = getLibraryForSign(account, library.provider);
    } else if (
      connectorId !== "injected" &&
      connectorsByName.walletconnect.provider
    ) {
      libraryToUse = getLibraryForSign(connectorsByName.walletconnect.provider);
    }
    setSelectedLibrary(libraryToUse);
  }, [account, library]);
  return { selectedLibrary };
};

export default useLibrary;
