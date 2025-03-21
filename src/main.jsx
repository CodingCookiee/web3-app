import { StrictMode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ToastContainer} from "react-toastify";
import { LoadingProvider } from "./context/loadingContext";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { metaMask, metaMaskHooks } from "./connectors/metaMask.js";
import { walletConnectV2, walletConnectV2Hooks } from "./connectors/walletConnectV2.js";

const connectors = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
]

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
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
    </LoadingProvider>
  </StrictMode>
);
