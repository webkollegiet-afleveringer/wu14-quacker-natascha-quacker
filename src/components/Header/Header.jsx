import './Header.sass';
import logo from '../../assets/quacker-logo.png';
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from 'react-router';
import { useAuth } from "../../hooks/useAuth.jsx";
import Menu from '../Menu/Menu';
import { useEffect, useState } from 'react';


export default function Header({ title }) {

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
                
                {/* On click - slide open menu on left */}

                <div className="header__avatar">
                    {/* show user avatar if user is logged in */}
                    {user ? (<img src={null} alt="User Avatar" className='header__user-avatar' onClick={toggleMenu} />) : ( <img src={logo} alt="Default Avatar" className='header__default-avatar' onClick={toggleMenu} />) }
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
                
                {/* <button>Done</button> */}
            
            </section>

        </header>
    )

}