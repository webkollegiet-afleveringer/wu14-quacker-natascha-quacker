import './Header.sass';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from "../../hooks/useAuth.jsx";
import Menu from '../Menu/Menu';
import defaultAvatar from '../../assets/default_avatar.png';
import logo from '../../assets/quacker-logo.png';
import { IoSettingsOutline } from "react-icons/io5";


export default function Header({ showAvatar = false }) {

    const { user, logout, loading } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);

    if (loading) return <p>Loading...</p>;
    const isLoggedIn = !!user;

    function toggleMenu() {
        setMenuOpen(prev => !prev);
    }


    return (
        <header className="header">

            <Menu 
                user={user} 
                logout={logout} 
                menuOpen={menuOpen} 
                closeMenu={() => setMenuOpen(false)} 
            />

            <section className='header__user-section'>
            
                {/* <button>back</button> */}
                
                <div className="header__avatar" style={{ display: showAvatar ? 'block' : 'none' }}>
                    {/* if user is logged in */}
                    {user ? (
                        // show their avatar if they have one, otherwise show the default avatar
                        <img 
                            src={user.avatar ? user.avatar : defaultAvatar} 
                            alt="User Avatar" 
                            className='header__avatar' 
                            onClick={toggleMenu} 
                        />
                    // if no user is logged in
                    ) : ( 
                        // show the default avatar and still allow access to the menu (which will show login/signup options instead of user info and logout)
                        <img 
                            src={logo} 
                            alt="Default Avatar" 
                            className='header__avatar' 
                            onClick={toggleMenu} 
                        />
                    )}
                </div>
            
            </section>
            
            <section className='header__logo-section'>
                
                {/* <img src={user.avatar.url} alt={user.username} /> */}

                {/* <h1 className='header__title'>{title}</h1> */}
                
                <img src={logo} alt="Logo" className='header__logo' />
                
                {/* <input type="text" placeholder="Search Quacker" /> */}
            
            </section>
            
            <section className='header__settings-section'>
                
                <Link to="/settings" className='header__settings'>
                    <IoSettingsOutline className='icon' />
                </Link>
            
            </section>

        </header>
    )

}