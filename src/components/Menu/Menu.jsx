import './Menu.sass';
import { Link } from 'react-router';
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { useAuth } from '../../hooks/useAuth.jsx';


export default function Menu({ user, logout, menuOpen, closeMenu }) {

    return (
        <section className={`menu ${menuOpen ? "open" : ""}`} onClick={closeMenu}>
            
            <div className="menu__content">
                {user ? (
                    // this section for when user is logged in
                    <section className="user" style={{ display: user ? 'block' : 'none' }}>
                        <div className="menu__user-info">
                            <img src={user.avatar ? user.avatar : null} alt="User Avatar" className='menu__user-avatar' />
                            <p className='menu__username'>{user.username ? user.username : ''}</p>
                        </div>
                        <div className="menu__user-messages">
                            {/* Link to messages with specific user */}
                            <Link to="/messages">
                                {/* insert image for the user who last messaged me */}
                                <img src="user-avatar" alt="user-avatar" />
                            </Link>
                            <Link to="/messages">
                                <PiDotsThreeOutlineLight />
                            </Link>
                        </div>
                        <div className="menu__user-stats">
                            <p>{user.following ? user.following.length : 0} Following</p>
                            <p>{user.followers ? user.followers.length : 0} Followers</p>
                        </div>
                    </section>
                ) : (
                    // this section for when no user is logged in
                    <section className="menu__guest" style={{ display: user ? 'none' : 'block' }}>
                        <p>Welcome to Quacker!</p>
                        <p>Please log in or register to access your profile, messages, and settings.</p>
                        <div className="menu__guest-options">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    </section>
                )}


                <nav className="menu__nav">
                    <ul>
                        {user ? <li><Link to="/profile">Profile</Link></li> : null}
                        {user ? <li><Link to="/lists">Lists</Link></li> : null}
                        <li><Link to="/notifications">Topics</Link></li>
                        {user ? <li><Link to="/bookmarks">Bookmarks</Link></li> : null}
                        <li><Link to="/moments">Moments</Link></li>
                    </ul>
                </nav>

                <Link to="/settings" className=''>Settings and Privacy</Link>

                <Link to="/help">Help Center</Link>


                {/* set up if/else for guest vs logged-in user */}
                {/* if logged in, show logout option */}
                {/* if not logged in, show login and register options */}
                {user ? <button onClick={logout}>Logout</button> : null}
                {!user ? (
                    <div className="menu__guest-options">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                ) : null}
            </div>

        </section>
        

    )
}