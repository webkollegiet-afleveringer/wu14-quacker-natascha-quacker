import '../style/_base.sass';
import { useLoaderData } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';
import Register from '../components/Register/Register';
import Login from '../components/Login/Login';
import CreateQuack from '../components/CreateQuack/CreateQuack';



export default function Home() {

    const { user, logout } = useAuth();
    console.log(user);
        

    const quacks = useLoaderData();
    console.log(quacks);
    

    return (
        <section className="home-page">
            <Header />


            {/* Move these to a Menu component, where they can be conditionally displayed based on whether the user is logged in or not */}
            
            {/* <Register />
            
            <Login />

            {user ? <p>Hej {user.username}</p> : <p>Ikke logget ind</p>}
            <button onClick={logout}>Logout</button> */}

            {/* <Register /> */}
            <Login />
            <CreateQuack />
            
            <Navigation />
        </section>
    )
}