import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import { Link } from 'react-router-dom';

import { FiUser, FiLogIn } from 'react-icons/fi';

export function Header() {

    const { signed, loadingAuth } = useContext(AuthContext);

    return (
        <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow-2xl mb-4'>
            <header className='w-full max-w-7xl flex justify-between items-center px-4 mx-auto'>
                <Link to="/">
                    <h3 className='text-xl font-bold text-zinc-600'>WP Veículos</h3>
                </Link>
                {!loadingAuth && signed && (
                    <div className='border-2 p-1 rounded-full border-gray-400'>
                        <Link to="/dashboard">
                            <FiUser size={22} color='#000' />
                        </Link>
                    </div>
                )}
                {!loadingAuth && !signed && (
                    <Link to="/login">
                        <FiLogIn size={22} color='#000' />
                    </Link>
                )}
            </header>
        </div>
    )
}