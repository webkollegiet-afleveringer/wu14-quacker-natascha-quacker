import './Menu.sass';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth.jsx';
import logo from '../../assets/quacker-logo.png';
import defaultAvatar from '../../assets/default_avatar.png';
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa6";
import { AiOutlineThunderbolt } from "react-icons/ai";


export default function Menu({ user, logout, menuOpen, closeMenu }) {

    return (
        <section className={`menu ${menuOpen ? "open" : ""}`} onClick={closeMenu}>
            
            <div className="menu__content">
                {user ? (
                    // this section for when user is logged in
                    <section className="menu__user" style={{ display: user ? 'grid' : 'none' }}>
                        <div className="menu__user-info">
                            <img src={user.avatar ? user.avatar : defaultAvatar} alt="User Avatar" className='menu__user-avatar' />
                            <p className='menu__username'>{user.username ? user.username : 'Username not available'}</p>
                        </div>
                        <div className="menu__user-messages">
                            {/* Link to messages with specific user */}
                            <Link to="/messages" className='menu__message-link'>
                                {/* insert image for the user who last messaged me */}
                                <img src={user.avatar ? user.avatar : defaultAvatar} alt="user-avatar" className='menu__message-avatar' />
                            </Link>
                            <Link to="/messages" className='menu__messages-link'>
                                <PiDotsThreeOutlineLight className='message-icon' />
                            </Link>
                        </div>
                        <div className="menu__user-stats">
                            <p><span>{user.following ? user.following.length : 0}</span> Following</p>
                            <p><span>{user.followers ? user.followers.length : 0}</span> Followers</p>
                        </div>
                    </section>
                ) : (
                    // this section for when no user is logged in
                    <section className="menu__guest" style={{ display: user ? 'none' : 'flex' }}>
                        <img src={logo} alt="Quacker Logo" className='menu__logo' />
                        <p className='menu__guest-title'>Welcome to Quacker!</p>
                    </section>
                )}


                {user ? (
                    <nav className="menu__nav">
                        <ul>
                            {/* links to current logged in user's profile */}
                            <li>
                                <Link to={`/users/${user.id}`} className='menu__profile-link'>
                                    <IoPersonOutline className='menu__icon' />
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to={`/lists/${user.id}`} className='menu__lists-link'>
                                    <CiViewList className='menu__icon' />
                                    Lists
                                </Link>
                            </li>
                            <li>
                                <Link to={`/notifications/${user.id}`} className='menu__notifications-link'>
                                    <BiMessageRoundedDetail className='menu__icon' />
                                    Topics
                                </Link>
                            </li>
                            <li>
                                <Link to={`/bookmarks/${user.id}`} className='menu__bookmarks-link'>
                                    <FaRegBookmark className='menu__icon' />
                                    Bookmarks
                                </Link>
                            </li>
                            <li>
                                <Link to={`/moments/${user.id}`} className='menu__moments-link'>
                                    <AiOutlineThunderbolt className='menu__icon' />
                                    Moments
                                </Link>
                            </li>
                        </ul>
                    </nav>
                ) : (
                    <nav className="menu__nav">
                        <ul>
                            <li>
                                <Link to="/" className='menu__home-link'>Home</Link>
                            </li>
                            <li>
                                <Link to="/users" className='menu__users-link'>Users</Link>
                            </li>
                            <li>
                                <Link to="/groups" className='menu__groups-link'>Groups</Link>
                            </li>
                        </ul>
                    </nav>
                )}
                

                <Link to="/settings" className='menu__settings-link'>
                    Settings and Privacy
                </Link>

                <Link to="/help" className='menu__help-link'>
                    Help Center
                </Link>


                {/* set up if/else for guest vs logged-in user */}
                {/* if logged in, show logout option */}
                {/* if not logged in, show login and register options */}
                {user ? <button onClick={logout} className='menu__user-logout'>
                    Logout
                </button> : null}
                {!user ? (
                    <div className="menu__guest-options">
                        <Link to="/login" className='menu__login-link'>
                            Login
                        </Link>
                        <Link to="/register" className='menu__register-link'>
                            Register
                        </Link>
                    </div>
                ) : null}
            </div>

        </section>
        

    )
}