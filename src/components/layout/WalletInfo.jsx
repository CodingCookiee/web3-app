import React from 'react';
import { Button } from '../ui/button';

const WalletInfo = () => {
    return (
        <div className="w-full h-full ">
            <div className="wallet-info flex items-center justify-center gap-4">
               
                <Button variant="default" size="lg" className='rounded-lg cursor-pointer'>Connect MetaMask</Button>
                <Button variant="default" size="lg" className='rounded-lg cursor-pointer'>Connect WalletConnect</Button>
                
            </div>
        </div>
    );
}

export default WalletInfo;
