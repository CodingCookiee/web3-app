import { StrictMode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ToastContainer, toast } from "react-toastify";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { metaMask, hooks as MetaMaskHooks } from "./connectors/metaMask.js";
import { walletConnectV2, hooks as WalletConnectV2Hooks } from "./connectors/walletConnectV2.js";

const connectors = [
  [metaMask, MetaMaskHooks],
  [walletConnectV2, WalletConnectV2Hooks],
]

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3ReactProvider connectors={connectors} >
    <App />
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      
    />
    </Web3ReactProvider>
  </StrictMode>
);
