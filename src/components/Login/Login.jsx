import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Login.sass";


export default function Login() {

    const { login } = useAuth();

    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await fetch(
                "https://natascha-quacker-api.onrender.com/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await res.json();

            if (!res.ok) {
                setError(result.field || "root", {
                    message: result.message
                });
                return;
            }

            login(result.user, result.token);

            navigate("/");

        }
        catch {
            setError("root", {
                message: "Network error"
            });
        }
    };

    return (
        <section className="login">
            <h1>Login</h1>

            <form className="login__form" onSubmit={handleSubmit(onSubmit)}>

                <label>
                    Email
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                    />
                    {errors.email && <p className="login__error">{errors.email.message}</p>}
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                    />
                    {errors.password && <p className="login__error">{errors.password.message}</p>}
                </label>

                {errors.root && <p className="login__error">{errors.root.message}</p>}

                <button type="submit" className="login__button">Login</button>

            </form>
        </section>
    );
}