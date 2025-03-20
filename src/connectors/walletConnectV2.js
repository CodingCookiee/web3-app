import { initializeConnector } from '@web3-react/core'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

export const [walletConnectV2, hooks] = initializeConnector(
    (actions) => new WalletConnectV2({
        actions,
        options: {
            projectId,
            chains: [137],
            optionalChainId: [1],
            showQrModal: true
        },
        onError: (error) => {
            console.error('Error in WalletConnect', error)
            throw error
        }
    })); 
