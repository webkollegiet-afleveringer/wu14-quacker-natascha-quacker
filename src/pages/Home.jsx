import '../style/_base.sass';
import { useLoaderData } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';
import Register from '../components/Register/Register';
import Login from '../components/Login/Login';
import CreateQuack from '../components/CreateQuack/CreateQuack';
import Quack from '../components/Quack/Quack';



export default function Home() {

    const { user, logout } = useAuth();
    console.log(user);
        

    const quacks = useLoaderData();
    console.log(quacks);
    

    return (
        <section className="home-page">
            <Header />

            <main>
            
                <section className="quacks">

                    {/* loop through quacks and display them */}
                    {quacks.map((quack) => (
                        <Quack key={quack.id} quack={quack} />
                    ))}
            
                </section>
            
            </main>

            {/* <Register /> */}
            <Login />
            <CreateQuack />
            
            <Navigation />
        </section>
    )
}