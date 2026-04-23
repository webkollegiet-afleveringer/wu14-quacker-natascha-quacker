import { useNavigate } from 'react-router';
import './Register.sass';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from '../../validation/authSchema';


export default function Register() {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const username = watch("username");

    const [usernameStatus, setUsernameStatus] = useState(null);

    useEffect(() => {
        if (!username) return;

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://natascha-quacker-api.onrender.com/users/check-username?username=${username}`
                );

                const data = await res.json();

                if (data.exists) {
                    setUsernameStatus("taken");
                }
                else {
                    setUsernameStatus("available");
                }
            }
            catch (err) {
                setUsernameStatus(null);
            }
        }, 500);

        return () => clearTimeout(timeout);
        
    }, [username]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch("https://natascha-quacker-api.onrender.com/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                // server errors (fx username exists)
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

    // handleChange function to update the formData state when the user types in the form fields
    // event parameter is the change event triggered by the input fields
    const handleChange = (event) => {
        // destructure the "name" and "value" properties from the event.target, which is the input field that triggered the change event
        const { name, value } = event.target;
        // update the formData state by spreading the previous formData and updating the specific field that changed (using the "name" property as the key and the "value" property as the new value for that field)
        setFormData({...formData, [name]: value });
    };


    return (

        <section className='register'>

            <h1>Create Quackount</h1>

            <form className='register__form' onSubmit={handleSubmit(onSubmit)}>

                <label>
                    <span className='register__label'>Full Name</span>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder='Full name' 
                        {...register("name")}
                    />
                    {usernameStatus === "taken" && (
                        <p className="register__error">Username is already taken</p>
                    )}

                    {usernameStatus === "available" && (
                        <p className="register__success">Username is available</p>
                    )}
                    {errors.name && <p className='register__error'>{errors.name.message}</p>}
                </label>

                <label>
                    <span className='register__label'>Username</span>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder='Username' 
                        {...register("username")}
                    />
                    {errors.username && <p className='register__error'>{errors.username.message}</p>}
                </label>

                <label>
                    <span className='register__label'>Email adresse</span>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder='Email adresse' 
                        {...register("email")}  
                    />
                    {errors.email && <p className="register__error">{errors.email.message}</p>}
                </label>
                
                <label>
                    <span className='register__label'>Password</span>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder='Password' 
                        {...register("password")} 
                        autoComplete="new-password" 
                    />
                    {errors.password && <p className='register__error'>{errors.password.message}</p>}
                </label>

                <label>
                    <span className='register__label'>Bekræft Password</span>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        placeholder='Bekræft Password' 
                        {...register("confirmPassword")}
                        autoComplete="new-password" 
                    />
                    {errors.confirmPassword && <p className='register__error'>{errors.confirmPassword.message}</p>}
                </label>

                <button type="submit" className='register__button'>Opret konto</button>
            
            </form>

        </section>
    )

}