import { NavLink } from 'react-router';
import './Navigation.sass';
import { PiHouseLineBold } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi";
import { FaRegEnvelope } from "react-icons/fa6";


export default function Navigation() {
    
    return (
        <nav className="navigation">

            <NavLink to="/" 
                className={({ isActive }) =>
                    `navigation__icon ${isActive ? "navigation__icon--active" : "navigation__icon"}`
                }
                end >
                <PiHouseLineBold className='icon' />
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