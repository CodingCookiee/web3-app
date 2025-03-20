import React from 'react';
import Header from '../components/layout/Header';
import WalletInfo from '../components/layout/WalletInfo';

const Dashboard = () => {
    return (
        <div className='w-full h-full min-h-screen flex flex-col 
        items-center justify-center gap-10'>
            <Header />
            <WalletInfo />
        </div>
    );
}

export default Dashboard;
