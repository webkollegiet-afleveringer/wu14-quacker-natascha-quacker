// This file defines the Register component, which renders a registration form and handles the registration process for new users.
// It uses the useForm hook from react-hook-form to manage the form state and validation, and the useNavigate hook from react-router to navigate to the home page after a successful registration.
// The component also includes real-time availability checks for the username and email fields by making API calls to the backend when the user stops typing for a short period of time (debouncing).

import { useEffect, useState } from "react";
import { useForm, Watch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import "./Register.sass";
import { registerSchema } from "../../validation/authSchema";


export default function Register() {
    // useNavigate hook to programmatically navigate to different routes. This allows the Register component to navigate to the home page ("/") after a successful registration.
    const navigate = useNavigate();

    // useForm hook to manage the form state and handle form submission. It provides the register function to register form fields, handleSubmit to handle form submission, setError to set form errors, and formState to access the current form errors.
    // We also use the zodResolver to integrate Zod schema validation with react-hook-form, allowing us to validate the form data against the defined registerSchema when the form is submitted.
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

    // watch function from react-hook-form to watch the values of the username and email fields in real-time. This allows us to implement the debounced availability check for these fields as the user types.
    const username = watch("username") || "";
    const email = watch("email") || "";

    // useState to manage the debounced values of the username and email fields.
    // These states will be updated after a short delay when the user stops typing, allowing us to make API calls to check the availability of the username and email without making a request on every keystroke.
    const [debouncedUsername, setDebouncedUsername] = useState(username);
    const [debouncedEmail, setDebouncedEmail] = useState(email);

    // useEffect hooks to implement the debouncing logic for the username and email fields.
    useEffect(() => {
        const t = setTimeout(() => {
            // update the debouncedUsername state with the current value of the username field after a delay of 400 milliseconds. This means that the availability check will only be triggered if the user stops typing for at least 400 milliseconds (0.4 seconds), reducing the number of API calls and improving performance.
            setDebouncedUsername(username);
        }, 400);

        // cleanup function to clear the timeout if the username value changes before the timeout completes.
        // This prevents multiple timeouts from being active at the same time and ensures that only the latest value of the username field is used for the availability check.
        return () => clearTimeout(t);
    }, [username]);


    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedEmail(email);
        }, 400);

        return () => clearTimeout(t);
    }, [email]);


    // useEffect to check the availability of the username and email fields whenever the debounced values change.
    // This effect will make an API call to the backend to check if the username or email is already taken, and set form errors accordingly if they are not available.
    useEffect(() => {
        const checkAvailability = async () => {
            // if both debouncedUsername and debouncedEmail are empty, return early and do not make an API call. This prevents unnecessary API calls when the user has not entered anything in either field.
            if (!debouncedUsername && !debouncedEmail) return;

            try {
                // new URLSearchParams to construct the query parameters for the API call based on the debouncedUsername and debouncedEmail values.
                // This allows us to send only the fields that have values to the backend for availability checking.
                // - If the user has entered a username but not an email, only the username will be checked; if they have entered an email but not a username, only the email will be checked; if they have entered both, both will be checked in the same API call.
                const params = new URLSearchParams();

                // if there is a debouncedUsername value,
                if (debouncedUsername) {
                    // - append it to the query parameters with the key "username" and the debounced value.
                    // This will allow the backend to check the availability of the username when the API call is made.
                    params.append("username", debouncedUsername);
                }
                // if there is a debouncedEmail value,
                if (debouncedEmail) {
                    // - append it to the query parameters with the key "email" and the debounced value.
                    params.append("email", debouncedEmail);
                }

                // make a GET request to the check-availability endpoint of the API with the appended params values, converted into a string, to check if the username and/or email is available.
                const res = await fetch(
                    `https://natascha-quacker-api.onrender.com/users/check-availability?${params.toString()}`
                );

                // if the response is not ok, throw an error to be caught in the catch block. This will handle any errors that occur during the API call, such as network errors or server errors.
                if (!res.ok) {
                    throw new Error("Failed to check availability");
                }
                // parse the response data as JSON to access the availability results for the username and email fields.
                const data = await res.json();

                // if the username is not available (data.usernameExists is true), set a form error for the username field with a message indicating that the username is already taken. This will inform the user that they need to choose a different username.
                if (data.usernameExists) {
                    setError("username", {
                        // type is set to "server" to indicate that this error is coming from the server-side validation (availability check) rather than client-side validation.
                        // leave this out and it will default to "manual", which is the default type for errors set with setError.
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
            // if there is a network error or any other error that occurs during the availability check API call, catch the error and set a general form error with a message indicating that there was a network error.
            // This will inform the user that something went wrong with the availability check and they may want to try again later.
            catch {
                setError("root", {
                    type: "server",
                    message: "Could not validate availability"
                });
            }
        };

        // call the checkAvailability function to perform the availability check whenever the debouncedUsername or debouncedEmail values change.
        checkAvailability();
        // include debouncedUsername, debouncedEmail, and setError in the dependency array to ensure that the effect runs whenever these values change.
        // This will allow us to check the availability of the username and email in real-time as the user types and updates the debounced values.
    }, [debouncedUsername, debouncedEmail, setError]);


    // onSubmit function to handle the form submission when the user attempts to register.
    // This function will make a POST request to the registration endpoint of the API with the form data to create a new user account.
    const onSubmit = async (data) => {
        try {
            // make a POST request to the registration endpoint of the API with the form data
            // - (name, username, email, password, confirmPassword)
            // to attempt to register the user.
            const res = await fetch(
                "https://natascha-quacker-api.onrender.com/users",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // body contains the form data as a JSON string, which will be sent to the backend for registration.
                    // The API will validate the data and attempt to create a new user account based on the provided information.
                    body: JSON.stringify(data)
                }
            );

            // parse the response from the API as JSON to access the result of the registration attempt, including any success message, error messages, and the newly created user data and token if the registration is successful.
            const result = await res.json();

            // if the response is not ok (registration failed), set form errors based on the response from the API.
            if (!res.ok) {
                // setError to set form errors based on the response from the API
                // result.field is the specific field that caused the error (example: username, email, password, etc.)
                // root is used for general errors that are not specific to a single field (example: network error)
                if (result.field) {
                    setError(result.field, {
                        type: "server",
                        message: result.message
                    });
                }

                // if the API returns an array of errors (example: from Zod validation in the file validation/authSchema.js)
                // Array.isArray is used to check if result.error is an array, which would indicate that there are multiple validation errors returned from the API.
                if (Array.isArray(result.error)) {
                    // loop through the errors
                    result.error.forEach((err) => {
                        // get the field name from the error path (example: "username", "email", etc.)
                        const field = err.path?.[0];

                        // if there is no field specified in the error path, return early and do not set an error. This prevents setting a form error without a specific field, which could cause confusion for the user.
                        if (!field) return;

                        // setError to set a form error for the specific field that caused the error, with the error message provided in the API response. This will inform the user about the specific issues with their registration input and allow them to correct it.
                        setError(field, {
                            type: "server",
                            message: err.message
                        });
                    });
                }

                // return to exit the onSubmit function early since the registration attempt failed and we don't want to proceed with registering the user or navigating to the home page.
                return;
            }

            // if the registration attempt is successful (response is ok), store the returned token and user data in localStorage
            // After saving these values, the user can log in and access protected routes that require authentication (profile or messages), and the application can display the user's information (example: avatar in header) in the UI.
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            // display a success message to the user indicating that the registration was successful. This provides feedback to the user that their account has been created successfully.
            alert("Registration successful!");
            
            // navigate to the home page ("/") after a successful registration to take the user to the main page of the application where they can see their feed and interact with other users.
            navigate("/");

        }
        // if there is a network error or any other error that occurs during the registration attempt that is not handled by the API response, catch the error and set a general form error with a message indicating that there was a network error. This will inform the user that something went wrong with the registration attempt.
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
                    <p className="register__label">Full Name</p>
                    <input {...register("name")} />
                    {errors.name && (
                        <p className="register__error">
                            {errors.name.message}
                        </p>
                    )}
                </label>

                <label>
                    <p className="register__label">Username</p>
                    <input {...register("username")} />
                    {errors.username && (
                        <p className="register__error">
                            {errors.username.message}
                        </p>
                    )}
                </label>

                <label>
                    <p className="register__label">Email</p>
                    <input type="email" {...register("email")} />
                    {errors.email && (
                        <p className="register__error">
                            {errors.email.message}
                        </p>
                    )}
                </label>

                <label>
                    <p className="register__label">Password</p>
                    <input type="password" {...register("password")} />
                    {errors.password && (
                        <p className="register__error">
                            {errors.password.message}
                        </p>
                    )}
                </label>

                <label>
                    <p className="register__label">Confirm Password</p>
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