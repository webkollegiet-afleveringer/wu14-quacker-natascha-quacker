import { useNavigate } from 'react-router';
import './Register.sass';
import { useState } from "react";
import { registerSchema } from '../../validation/authSchema';


export default function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();

        let newErrors = {};

        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            for (const err of result.error.issues) {
                const field = err.path[0];
                if (!newErrors[field]) {
                    newErrors[field] = err.message;
                }
            }
        }

        try {
            const response = await fetch(
                "https://natascha-quacker-api.onrender.com/users",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (data.field) {
                    newErrors[data.field] = data.message;
                }
                else if (data.error && Array.isArray(data.error)) {
                    for (const err of data.error) {
                        const field = err.path?.[0];
                        if (field) {
                            newErrors[field] = err.message;
                        }
                    }
                }
                else {
                    newErrors.general = data.message;
                }
            }

            if (!response.ok) {
                if (data.field) {
                    newErrors[data.field] = data.message;
                }

                if (data.error && Array.isArray(data.error)) {
                    for (const err of data.error) {
                        const field = err.path?.[0];
                        if (field) {
                            newErrors[field] = err.message;
                        }
                    }
                }
            }

        }
        catch (error) {
            newErrors.general = "Network error";
        }

        setErrors(newErrors);
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

            <form className='register__form' onSubmit={handleSubmit}>

                <label>
                    <span className='register__label'>Full Name</span>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder='Full name' 
                        onChange={handleChange}
                        value={formData.name} 
                    />
                    {errors.name && <p className='register__error'>{errors.name}</p>}
                </label>

                <label>
                    <span className='register__label'>Username</span>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder='Username' 
                        onChange={handleChange}
                        value={formData.username} 
                    />
                    {errors.username && <p className='register__error'>{errors.username}</p>}
                </label>

                <label>
                    <span className='register__label'>Email adresse</span>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder='Email adresse' 
                        onChange={handleChange}
                        value={formData.email}  
                    />
                    {errors.email && <p className='register__error'>{errors.email}</p>}
                </label>
                
                <label>
                    <span className='register__label'>Password</span>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder='Password' 
                        onChange={handleChange}
                        value={formData.password} 
                        autoComplete="new-password" 
                    />
                    {errors.password && <p className='register__error'>{errors.password}</p>}
                </label>

                <label>
                    <span className='register__label'>Bekræft Password</span>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        placeholder='Bekræft Password' 
                        onChange={handleChange}
                        value={formData.confirmPassword} 
                        autoComplete="new-password" 
                    />
                    {errors.confirmPassword && <p className='register__error'>{errors.confirmPassword}</p>}
                </label>

                <button type="submit" className='register__button'>Opret konto</button>
            
            </form>

        </section>
    )

}