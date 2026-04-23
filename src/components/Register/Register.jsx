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
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit"
    });

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

        }
        catch (err) {
            setError("root", {
                type: "server",
                message: "Network error. Please try again."
            });
        }
    };

    return (
        <section className="register">
            <h1>Create Quackount</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="register__form">

                <label>
                    Full Name
                    <input
                        type="text"
                        placeholder="Full name"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="register__error">
                            {errors.name.message}
                        </p>
                    )}
                </label>

                <label>
                    Username
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username")}
                    />
                    {errors.username && (
                        <p className="register__error">
                            {errors.username.message}
                        </p>
                    )}
                </label>

                <label>
                    Email adresse
                    <input
                        type="email"
                        placeholder="Email adresse"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="register__error">
                            {errors.email.message}
                        </p>
                    )}
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="register__error">
                            {errors.password.message}
                        </p>
                    )}
                </label>

                <label>
                    Bekræft Password
                    <input
                        type="password"
                        placeholder="Bekræft Password"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                    />
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