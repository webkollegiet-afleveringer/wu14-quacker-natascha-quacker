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
        clearErrors,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });

    const username = watch("username") || "";

    const [debouncedUsername, setDebouncedUsername] = useState(username);

    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUsername(username);
        }, 400);

        return () => clearTimeout(timer);
    }, [username]);


    useEffect(() => {
        const checkUsername = async () => {
            if (!debouncedUsername) return;
            if (debouncedUsername.length > 100) return;

            try {
                const res = await fetch(
                    `https://natascha-quacker-api.onrender.com/users/check-username?username=${encodeURIComponent(
                        debouncedUsername
                    )}`
                );

                const data = await res.json();

                if (data.exists) {
                    setError("username", {
                        type: "server",
                        message: "Username is already taken"
                    });
                } else {
                    clearErrors("username");
                }

            } catch {
                setError("username", {
                    type: "server",
                    message: "Could not validate username"
                });
            }
        };

        checkUsername();
    }, [debouncedUsername, setError, clearErrors]);


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
                if (result.field) {
                    setError(result.field, {
                        type: "server",
                        message: result.message
                    });
                }

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

            navigate("/");

        } catch {
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
                    {errors.name && <p>{errors.name.message}</p>}
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
                    {errors.email && <p>{errors.email.message}</p>}
                </label>

                <label>
                    Password
                    <input type="password" {...register("password")} />
                    {errors.password && <p>{errors.password.message}</p>}
                </label>

                <label>
                    Confirm Password
                    <input type="password" {...register("confirmPassword")} />
                    {errors.confirmPassword && (
                        <p>{errors.confirmPassword.message}</p>
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