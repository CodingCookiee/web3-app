import React from 'react';
import Header from '../components/layout/Header';
import ContractInteractions from '../components/layout/ContractInteractions';
const Dashboard = () => {
    return (
        <div className='w-full h-full min-h-screen  
        flex flex-col items-center justify-center gap-10 px-5 py-5'>
            <Header />
            <div className='w-[85%] lg:px-20 flex flex-col items-start gap-2.5'>

            <ContractInteractions />
            </div>
        </div>
    );
}

export default Dashboard;

