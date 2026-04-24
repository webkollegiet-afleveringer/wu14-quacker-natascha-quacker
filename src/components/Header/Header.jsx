import './Header.sass';
import logo from '../../assets/quacker-logo.svg';
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from 'react-router';
import { useAuth } from "../../hooks/useAuth.jsx";



export default function Header({ title }) {

    const { user, logout, loading } = useAuth();

    if (loading) return <p>Loading...</p>;
    const isLoggedIn = !!user;

    function openMenu() {
        
        // when clicking the avatar in the header, open the Menu component that slides in from the left side of the screen.
        // The Menu component should contain links to the user's profile, messages, and settings, as well as a logout button if the user is logged in. This will provide easy access to important user features and settings from the header.

        console.log("open menu");
    }


    return (
        <header className="header">

            <section className='header__user-section'>
            
                {/* <button>back</button> */}
                
                {/* On click - slide open menu on left */}
                {/* make menu component */}
                
                <div className="header__avatar">
                    {/* show user avatar if user is logged in */}
                    {user ? (<img src={null} alt="User Avatar" className='header__user-avatar' onClick={openMenu} />) : ( <img src={logo} alt="Default Avatar" className='header__default-avatar' onClick={openMenu} />) }                    
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