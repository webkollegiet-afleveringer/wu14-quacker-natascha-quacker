import { useLoaderData } from 'react-router';
import '../style/_base.sass';
import Navigation from '../components/Navigation/Navigation';
import Register from '../components/Register/Register';


export default function Home() {

    const users = useLoaderData();
    console.log(users);
    

    return (
        <section className="home-page">
            <h1>Home</h1>

            <Register />

            <Navigation />
        </section>
    )
}