import { random } from 'lodash'

// Array of available nodes to connect to
export const nodes = [
  import.meta.env.VITE_NODE_1 || 'https://polygon-rpc.com',
  import.meta.env.VITE_NODE_2 || 'https://polygon-rpc.com',
  import.meta.env.VITE_NODE_3 || 'https://polygon-rpc.com'
]

const getNodeUrl = () => {
    const randomIndex = random(0, nodes.length - 1)
    return nodes[randomIndex]
}

export default getNodeUrl