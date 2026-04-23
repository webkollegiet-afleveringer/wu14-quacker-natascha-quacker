import { useState } from 'react';
import { loginSchema } from '../../validation/authSchema';
import './Login.sass';
import { useNavigate } from 'react-router';


export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setErrors({ general: "No token found. Please register first." });
            return;
        }
        
        // Check if token is valid by sending a request to the server with the token in the Authorization header and see if we get a valid response back, if not, show an error message to the user
        // check if token matches a token in the database
        // if token is in the database, check if it belongs to the email trying to sign in


        const result = loginSchema.safeParse(formData);

        if (result.success) {
            setErrors({});
            console.log('Form is valid:', result.data);

            try {
                const response = await fetch('https://natascha-quacker-api.onrender.com/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Server responded with ${response.status}`);
                }

                console.log('User logged in successfully:', data);

                localStorage.setItem("token", data.token);

                localStorage.setItem("user", JSON.stringify(data.user));

                navigate('/');
                
                setFormData({
                    email: '',
                    password: ''
                });

            } catch (error) {
                console.error('Error logging in user:', error);
            }

            return;
        }

        const errors = {};

        for (const err of result.error.issues) {
            const field = err.path[0];

            if (!errors[field]) {
                errors[field] = err.message;
            }
        }
        
        setErrors(errors);
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
        <section className="login-page">
            <h1>Login</h1>
            
        </section>
    )

}