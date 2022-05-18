import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {FaCaretDown, FaTrophy, FaPlus, FaTwitter} from 'react-icons/fa';
import {IoPodium} from 'react-icons/io5'
import {CgLogOut} from 'react-icons/cg';
import classNames from 'classnames';

import { useAPI } from '../../API';

import Logo from './logo.svg';

function Navbar(){
    let user = useSelector((state)=> state.user);
    let signedIn = !!user.token
    let [showDropdown, setShowDropdown] = useState(false);
    let {signIn, signOut} = useAPI();

    const toggleDropdown = () => setShowDropdown(prev => !prev)

    const handleSignin = () =>{
        signIn();
    }

    

    return(
        <div className="flex justify-between items-center px-4 py-4 absolute w-full z-50">
            <Link to={"/"} className="flex items-center gap-2 self-start">
                    <img src={Logo} className="w-12" alt='tweedle logo'/>
                    <h3 className='hidden sm:inline font-medium mt-2'>Tweedle</h3>
            </Link>

            <div className='flex gap-6 md:gap-16'>
            {!signedIn ? <Link to={"/leaderboard"} className="self-start mt-1 bg-accent rounded-3xl px-4 py-2 
                transition-all hover:bg-white hover:text-light-blue
                active:bg-white active:text-light-blue md:px-8">
                <FaTrophy className='inline-block text-xl'/>
                <span className='hidden md:inline-block md:ml-3'>Leaderboard</span>
            </Link>:<></>}
            {signedIn ?
                <div id="dropdown" className='bg-accent group rounded-3xl
                    pl-2 pr-5 pt-2 cursor-pointer' onClick={() => toggleDropdown()}>
                    <div className='flex items-center gap-4 mb-2'>
                        <img className='bg-white w-7 rounded-3xl' src={user.picture} alt="dp"/>
                        <h4 className='font-medium overflow-hidden whitespace-nowrap'>{user.handle}</h4>
                        <FaCaretDown />
                    </div>
                    <div className={classNames('overflow-hidden text-right','transition-all',
                        {'pb-2 max-h-48': showDropdown, 'max-h-0': !showDropdown})}>
                        <Link to={''} className='block mb-6 text-base'>
                            <FaPlus className='inline-block text-xl mr-2'/> New game
                        </Link>
                        <Link to={`@${user.handle}`} className='block mb-3 text-base'>
                            <IoPodium className='inline-block text-xl mr-2'/> My Rank
                        </Link>
                        <Link to={"leaderboard"} className='block mb-8 text-base'>
                            <FaTrophy className='inline-block text-xl mr-2'/> Leaderboard
                        </Link>
                        <button className='ml-auto block' onClick={signOut}>
                            <CgLogOut className='inline mr-2 text-xl'/>Sign out
                        </button>
                    </div>
                </div>
            :
                <button className='font-medium bg-accent rounded-3xl px-10 py-3 
                transition-all hover:bg-white hover:text-light-blue
                active:bg-white active:text-light-blue' onClick={handleSignin}>
                    <FaTwitter className='inline-block text-xl mr-2'/> Sign in
                </button>
            }
            </div>
        </div>
    )
}

export default Navbar;