import Header from '../components/Header/Header';
import LoginForm from '../components/LoginForm/LoginForm';
import Navigation from '../components/Navigation/Navigation';


export default function Login() {
    return (
        <section className="login-page">
            
            <Header />
            
            <main>
                <LoginForm />
            </main>
            
            <Navigation />

        </section>
    )
}