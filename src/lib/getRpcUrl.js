import { random } from 'lodash';

export const nodes =[
    import.meta.env.VITE_NODE_1,
    import.meta.env.VITE_NODE_2,
    import.meta.env.VITE_NODE_3,
    
]

const getNodeUrl = () => {
    const randomIndex = random(nodes.length);
    return nodes[randomIndex];
}

export default getNodeUrl;