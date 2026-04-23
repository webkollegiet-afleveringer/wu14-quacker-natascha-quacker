import { useLoaderData } from 'react-router';
import '../style/_base.sass';
import Navigation from '../components/Navigation/Navigation';
import Register from '../components/Register/Register';
import Login from '../components/Login/Login';
import { useAuth } from '../hooks/useAuth';


export default function Home() {

    const { user, logout } = useAuth();
    // const user = useCurrentUser();

    const users = useLoaderData();
    console.log(users);
    

    return (
        <section className="home-page">
            <h1>Home</h1>

            <Register />
            
            <Login />

            {user ? <p>Hej {user.username}</p> : <p>Ikke logget ind</p>}
            <button onClick={logout}>Logout</button>

            <Navigation />
        </section>
    )
}