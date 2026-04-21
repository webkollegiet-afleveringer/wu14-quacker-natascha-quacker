import { useNavigate } from 'react-router';
import './Register.sass';
import { useState } from "react";
// import { registerSchema } from '../../utils/validation';


export default function Register() {

    // OBS: INSTALL ZOD WITH "npm install zod" TO USE THE registerSchema FOR FORM VALIDATION

    const navigate = useNavigate();

    // formData state to hold the values of the form fields
    // setFormData function to update the formData state when the user types in the form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // errors state to hold the validation error messages for each form field
    // setErrors function to update the errors state when validating the form
    const [errors, setErrors] = useState({});

    // handleSubmit function when submitting the form
    const handleSubmit = (event) => {
        // prevent the default form submission behavior
        // the default behavior would cause the page to reload, which we don't want in a React application
        event.preventDefault();

        // registerSchema.safeParse(formData) will return an object with a success property that is true if the validation passed and false if it failed, and an error property that contains the validation errors if it failed
        const result = registerSchema.safeParse(formData);

        // if the success property is true, it means the form data is valid and we can proceed with submitting the form or showing a success message
        if (result.success) {
            // clear any previous errors, because the form is now valid
            setErrors({});
            // log the valid form data to the console 
            // (in a real application, you would submit the form data to an API or perform some other action here)
            console.log('Form is valid:', result.data);

            // POST to http://localhost:3000/users with the formData as the request body to create a new user in the database
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to register user');
                }
                return response.json();
            })
            .then(data => {
                console.log('User registered successfully:', data);
            })
            .catch(error => {
                console.error('Error registering user:', error);
            });

            // if registration is successful, use react router to navigate the user to the homepage
            navigate('/');
            
            // clear the form fields by resetting the formData state to its initial values (empty strings)
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

            // "return" to exit the handleSubmit function early, so that the code below that sets the errors state does not run when the form is valid
            return;
        }

        // if the success property is false, it means the form data is invalid
        // errors variable to hold the validation error messages for each form field, which we will extract from the result.error.issues array
        const errors = {};

        // loop through the result.error.issues array, which contains an object for each validation error
        for (const err of result.error.issues) {
            // field variable to hold the name of the invalid field, which is the first element of the "path" array in the error object (e.g. "email" or "password")
            const field = err.path[0];

            // if there is not already an error message for this field in the errors object, add the error message from the validation error object to the errors object with the field name as the key (e.g. errors.email = "Email is required")
            if (!errors[field]) {
                // add the error message from the validation error object to the errors object with the field name as the key (e.g. errors.email = "Email is required")
                errors[field] = err.message;
            }
        }
        
        // set the errors state to the errors object we just created, which will trigger a re-render of the component and display the error messages next to the form fields
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

        <section className='register'>

            <h1>Create Quackount</h1>

            <form className='register__form' onSubmit={handleSubmit}>

                <label>
                    <span className='register__label'>Fulde navn</span>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder='Fulde navn' 
                        onChange={handleChange}
                        value={formData.name} 
                        autoComplete="new-text" 
                    />
                    {errors.name && <p className='register__error'>{errors.name}</p>}
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
                        autoComplete="new-text" 
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