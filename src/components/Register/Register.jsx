import { useEffect, useState } from "react";
import { useForm, Watch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import "./Register.sass";
import { registerSchema } from "../../validation/authSchema";


export default function Register() {
    const navigate = useNavigate();

    // MARK: React Hook Form
    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });

    const username = watch("username") || "";
    console.log("checking username:", username);
    const [usernameError, setUsernameError] = useState(null);

    useEffect(() => {
        if (!username || username.length < 3) return;

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://natascha-quacker-api.onrender.com/users/check-username?username=${encodeURIComponent(username)}`
                );

                if (!res.ok) return;

                const data = await res.json();

                setError("username", {
                    type: "manual",
                    message: data.exists ? "Username is already taken" : ""
                });

            } catch (err) {
                console.log("check failed");
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [username]);

    // MARK: Submit
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
                // backend validation errors (fx username exists)
                if (result.field) {
                    setError(result.field, {
                        type: "server",
                        message: result.message
                    });
                }

                if (result.error && Array.isArray(result.error)) {
                    result.error.forEach((err) => {
                        const field = err.path?.[0];
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
        }
        catch (err) {
            setError("root", {
                type: "server",
                message: "Network error"
            });
        }
    };


    return (
        <section className='register'>
            <h1>Create Quackount</h1>

            <form className='register__form' onSubmit={handleSubmit(onSubmit)}>

                <label>
                    <span className='register__label'>Full Name</span>
                    <input
                        type="text"
                        placeholder="Full name"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className='register__error'>
                            {errors.name.message}
                        </p>
                    )}
                </label>

                <label>
                    <span className='register__label'>Username</span>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username")}
                    />

                    {errors.username && (
                        <p className='register__error'>
                            {errors.username.message}
                        </p>
                    )}
                </label>

                <label>
                    <span className='register__label'>Email adresse</span>
                    <input
                        type="email"
                        placeholder="Email adresse"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className='register__error'>
                            {errors.email.message}
                        </p>
                    )}
                </label>

                <label>
                    <span className='register__label'>Password</span>
                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className='register__error'>
                            {errors.password.message}
                        </p>
                    )}
                </label>

                <label>
                    <span className='register__label'>Bekræft Password</span>
                    <input
                        type="password"
                        placeholder="Bekræft Password"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className='register__error'>
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </label>

                {/* GENERAL ERROR */}
                {errors.root && (
                    <p className='register__error'>
                        {errors.root.message}
                    </p>
                )}

                <button type="submit" className='register__button'>
                    Opret konto
                </button>

            </form>
        </section>
    );
}