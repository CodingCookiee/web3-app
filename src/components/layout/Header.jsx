import React from 'react';
import Text from '../ui/Text';

const Header = () => {
    return (
        <div className="header w-full h-full flex flex-col items-center justify-center ">
            <div className="flex flex-col justify-center items-center
             w-2/3 h-full py-10 cursor-pointer border  border-gray-400 rounded-lg shadow-lg">
            <Text variant="h1">Welcome to Web3 Wallet            </Text>
            <Text variant="h4" color="secondary" align="center" >
            Connect your wallet to get started
                </Text>

            </div>
        </div>
    );
}

export default Header;
