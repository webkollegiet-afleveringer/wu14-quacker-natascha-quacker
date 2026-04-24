// This file defines the Login component, which renders a login form and handles the login process for users.
// It uses the useForm hook from react-hook-form to manage the form state and validation, and the useAuth hook to access the authentication context and update the authentication state when a user successfully logs in.
// The component also uses the useNavigate hook from react-router to navigate to the home page after a successful login.

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Login.sass";


export default function Login() {

    // useAuth hook to access the authentication state and functions provided by the AuthContext. This allows the Login component to call the login function to update the authentication state when a user successfully logs in.
    const { login } = useAuth();

    // useForm hook to manage the form state and handle form submission. It provides the register function to register form fields, handleSubmit to handle form submission, setError to set form errors, and formState to access the current form errors.
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    
    // useNavigate hook to programmatically navigate to different routes. This allows the Login component to navigate to the home page ("/") after a successful login.
    const navigate = useNavigate();

    // onSubmit function to handle the form submission (when a user clicks the login button)
    const onSubmit = async (data) => {
        try {
            // make a POST request to the login endpoint of the API with the form data (email and password) to attempt to log in the user
            const res = await fetch(
                "https://natascha-quacker-api.onrender.com/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // body contains the form data (email and password) as a JSON string
                    body: JSON.stringify(data)
                }
            );

            // parse the response from the API as JSON to access the result of the login attempt
            const result = await res.json();

            // if the response is not ok (login failed), set form errors based on the response from the API.
            // The API may return a field-specific error (if the email or password is incorrect) or a general error message.
            if (!res.ok) {
                // setError to set form errors based on the response from the API
                // result.field is the specific field that caused the error (email or password)
                // root is used for general errors that are not specific to a single field (example: network error)
                setError(result.field || "root", {
                    // message is the error message returned from the API to display to the user
                    message: result.message
                });
                // return to exit the onSubmit function early since the login attempt failed and we don't want to proceed with logging in the user or navigating to the home page
                return;
            }

            // if the login attempt is successful (response is ok), call the login function from the AuthContext to update the authentication state with the logged in user data and token returned from the API.
            // This will allow the rest of the application to recognize that a user is now logged in and update the UI accordingly.
            // example: the users avatar is now displayed in the header, and the user can access protected routes that require authentication (profile or messages).
            login(result.user, result.token);

            // navigate to the home page ("/") after a successful login to take the user to the main page of the application where they can see their feed and interact with other users.
            navigate("/");

        }
        // if there is a network error or any other error that occurs during the login attempt that is not handled by the API response, catch the error and set a general form error with a message indicating that there was a network error. This will inform the user that something went wrong with the login attempt.
        catch {
            setError("root", {
                message: "Network error"
            });
        }
    };


    return (
        <section className="login">
            <h1>Login</h1>

            {/* set the form submission handler */}
            {/* we do it like this instead of just onSubmit={onSubmit} because we need to use the handleSubmit function from react-hook-form and specify that it needs to use the onSubmit function that we defined */}
            <form className="login__form" onSubmit={handleSubmit(onSubmit)}>

                <label>
                    <p className="login__label">Email</p>
                    <input
                        type="email"
                        placeholder="Email"
                        // ...register makes the input field a controlled component and registers it with react-hook-form, allowing us to manage its state and handle validation.
                        // The "email" argument is the name of the field that will be used to access its value in the form data when the form is submitted.
                        // without ...register, the input field would not be registered with react-hook-form and we would not be able to access its value or manage its state through react-hook-form.
                        {...register("email")}
                    />
                </label>

                <label>
                    <p className="login__label">Password</p>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                    />
                </label>

                {/* Display validation errors for the email and password fields */}
                {/* if errors.email exists, display the error message; otherwise, check if errors.password exists and display its message */}
                {errors.email && <p className="login__error">{errors.email.message}</p> || errors.password && <p className="login__error">{errors.password.message}</p>}
                
                {/* Display a general form error if one exists */}
                {errors.root && <p className="login__error">{errors.root.message}</p>}

                <button type="submit" className="login__button">Login</button>

            </form>
        </section>
    );
}