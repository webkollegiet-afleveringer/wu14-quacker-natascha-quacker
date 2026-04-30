import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';
import RegisterForm from '../components/RegisterForm/RegisterForm';


export default function Register() {
    return (
        <section className="register-page">

            <Header />

            <main>

                <RegisterForm />

            </main>

            <Navigation />

        </section>
    )
}