import '../style/_base.sass';
import { useLoaderData } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';
import CreateQuackButton from '../components/CreateQuackButton/CreateQuackButton';
import Quack from '../components/Quack/Quack';



export default function Home() {

    // get the user data from the useAuth hook, which is used to get the current logged in user and their data
    const { user, logout } = useAuth();
    // console.log(user); 

    // get the quacks data from the quacksLoader, which is used as a loader for this route in App.jsx
    const { quacks } = useLoaderData();
    console.log(quacks);
    

    return (
        <section className="home-page">
            <Header showAvatar={true} />

            <main>
            
                <section className="quacks">

                    {/* loop through quacks and display them */}
                    {quacks.map((quack) => (
                        <Quack key={quack.id} quack={quack} />
                    ))}
            
                </section>

                {/* blue button to create a new quack */}
                <CreateQuackButton />

            </main>
            
            <Navigation />

        </section>
    )
}