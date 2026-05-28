import { Link } from 'react-router';
import './CreateQuackButton.sass';
import { RiQuillPenAiFill } from "react-icons/ri";
import { useAuth } from '../../hooks/useAuth';


export default function CreateQuackButton() {
    
    // only show button if user is logged in
    const { user } = useAuth();
    
    if (!user) {
        return null;
    }

    return (
        <Link to="/create-quack" className="create-quack-button">
            <RiQuillPenAiFill />
        </Link>
    )

}