import { useLoaderData } from 'react-router';
import '../style/_base.sass';


export default function Home() {

    const users = useLoaderData();
    console.log(users);
    

    return (
        <section className="home-page">
        <h1>Home</h1>
        </section>
    )
}