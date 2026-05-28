import { NavLink, useLocation } from 'react-router';
import './Navigation.sass';
import { PiHouseLineBold } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi";
import { FaRegEnvelope } from "react-icons/fa6";


export default function Navigation() {

    // useLocation hook to determine which page the user is currently on and apply active class to the corresponding nav link
    const location = useLocation();

    // check if the current location is the home page or a user profile page (which also should have the home icon active)
    const isHomeActive =
        location.pathname === "/" ||
        location.pathname.startsWith("/users");
    
    return (
        <nav className="navigation">

            {/* home icon still only links to home page */}
            <NavLink
                to="/"
                // if the current location is the home page or a user profile page, apply the active class to the home icon
                className={`navigation__icon ${
                    isHomeActive ? "navigation__icon--active" : ""
                }`}
            >
                <PiHouseLineBold className="icon" />
            </NavLink>

            <NavLink to="/search" 
                className={({ isActive }) =>
                    `navigation__icon ${isActive ? "navigation__icon--active" : "navigation__icon"}`
                }>
                <FiSearch className='icon' />
            </NavLink>

            <NavLink to="/notifications" 
                className={({ isActive }) =>
                    `navigation__icon ${isActive ? "navigation__icon--active" : "navigation__icon"}`
                }>
                <HiOutlineBell className='icon' />
            </NavLink>

            <NavLink to="/messages" 
                className={
                ({ isActive }) =>
                    `navigation__icon ${isActive ? "navigation__icon--active" : "navigation__icon"}`
                }>
                <FaRegEnvelope className='icon' />
            </NavLink>

        </nav>
    );

}