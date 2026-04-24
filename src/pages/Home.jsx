import '../style/_base.sass';
import { useLoaderData } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';
// import Register from '../components/Register/Register';
import Login from '../components/Login/Login';



export default function Home() {

    const { user, logout } = useAuth();

    // if you want to get current user data without using AuthContext, you can use the useCurrentUser hook like this:
    // import useCurrentUser from '../hooks/useCurrentUser'; - MOVE THIS TO TOP
    // const user = useCurrentUser();

    const users = useLoaderData();
    console.log(users);
    

    return (
        <section className="home-page">
            <Header />


            {/* Move these to a Menu component, where they can be conditionally displayed based on whether the user is logged in or not */}
            
            {/* <Register />
            
            <Login />

            {user ? <p>Hej {user.username}</p> : <p>Ikke logget ind</p>}
            <button onClick={logout}>Logout</button> */}

            <Login />
            
            <Navigation />
        </section>
    )
}