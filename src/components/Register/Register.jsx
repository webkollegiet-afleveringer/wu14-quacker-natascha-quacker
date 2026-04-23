import { useEffect, useState } from "react";
import { useForm, Watch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import "./Register.sass";
import { registerSchema } from "../../validation/authSchema";


export default function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });

    const username = watch("username") || "";
    const email = watch("email") || "";

    const [debouncedUsername, setDebouncedUsername] = useState(username);
    const [debouncedEmail, setDebouncedEmail] = useState(email);

    
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedUsername(username);
        }, 400);

        return () => clearTimeout(t);
    }, [username]);


    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedEmail(email);
        }, 400);

        return () => clearTimeout(t);
    }, [email]);


    useEffect(() => {
        const checkAvailability = async () => {
            if (!debouncedUsername && !debouncedEmail) return;

            try {
                const params = new URLSearchParams();

                if (debouncedUsername) {
                    params.append("username", debouncedUsername);
                }

                if (debouncedEmail) {
                    params.append("email", debouncedEmail);
                }

                const res = await fetch(
                    `https://natascha-quacker-api.onrender.com/users/check-availability?${params.toString()}`
                );

                const data = await res.json();

                if (data.usernameExists) {
                    setError("username", {
                        type: "server",
                        message: "Username is already taken"
                    });
                }

                if (data.emailExists) {
                    setError("email", {
                        type: "server",
                        message: "Email is already in use"
                    });
                }

            }
            catch {
                // optional global error
                setError("root", {
                    type: "server",
                    message: "Could not validate availability"
                });
            }
        };

        checkAvailability();
    }, [debouncedUsername, debouncedEmail, setError]);


    const onSubmit = async (data) => {
        try {
            const res = await fetch(
                "https://natascha-quacker-api.onrender.com/users",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                }
            );

            const result = await res.json();

            if (!res.ok) {

                // single field error (username/email exists fallback)
                if (result.field) {
                    setError(result.field, {
                        type: "server",
                        message: result.message
                    });
                }

                // zod backend errors
                if (Array.isArray(result.error)) {
                    result.error.forEach((err) => {
                        const field = err.path?.[0];

                        if (!field) return;

                        setError(field, {
                            type: "server",
                            message: err.message
                        });
                    });
                }

                return;
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            alert("Registration successful!");
            
            navigate("/");

        }
        catch {
            setError("root", {
                type: "server",
                message: "Network error"
            });
        }
    };

    return (
        <section className="register">
            <h1>Create Quackount</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="register__form">

                <label>
                    Full Name
                    <input {...register("name")} />
                    {errors.name && (
                        <p className="register__error">
                            {errors.name.message}
                        </p>
                    )}
                </label>

                <label>
                    Username
                    <input {...register("username")} />
                    {errors.username && (
                        <p className="register__error">
                            {errors.username.message}
                        </p>
                    )}
                </label>

                <label>
                    Email
                    <input type="email" {...register("email")} />
                    {errors.email && (
                        <p className="register__error">
                            {errors.email.message}
                        </p>
                    )}
                </label>

                <label>
                    Password
                    <input type="password" {...register("password")} />
                    {errors.password && (
                        <p className="register__error">
                            {errors.password.message}
                        </p>
                    )}
                </label>

                <label>
                    Confirm Password
                    <input type="password" {...register("confirmPassword")} />
                    {errors.confirmPassword && (
                        <p className="register__error">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </label>

                {errors.root && (
                    <p className="register__error">
                        {errors.root.message}
                    </p>
                )}

                <button type="submit" className="register__button">
                    Opret konto
                </button>

            </form>
        </section>
    );
}