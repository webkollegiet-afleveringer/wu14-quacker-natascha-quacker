import { Link, useNavigate } from 'react-router';
import { quackSchema } from '../../validation/quackSchema';
import './CreateQuackForm.sass';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';


export default function CreateQuackForm() {

    // get current logged in user from AuthContext to check if user is logged in and to get the user's token for authentication when making the API request to create a quack.
    // user is not used in the current implementation of this form, but it can be used in the future to associate the created quack with the logged-in user or to display the user's information in the form.
    const { user } = useAuth();
    

    const navigate = useNavigate();

    // useForm hook to manage the form state and handle form submission. It provides the register function to register form fields, handleSubmit to handle form submission, setError to set form errors, and formState to access the current form errors.
    // We also use the zodResolver to integrate Zod schema validation with react-hook-form, allowing us to validate the form data against the defined quackSchema when the form is submitted.
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(quackSchema),
        mode: "onChange"
    });

    const onSubmit = async (data) => {

        console.log("SUBMIT FIRED", data);
        
        try {
            // make a POST request to the quacks endpoint of the API with the form data
            const res = await fetch(
                "https://natascha-quacker-api.onrender.com/quacks",
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}` // include the user's token in the Authorization header for authentication when creating a quack. This ensures that only authenticated users can create quacks, and the API can associate the created quack with the correct user based on the token.
                    },
                    // body contains the form data as a JSON string, which will be sent to the backend for creating a quack.
                    // The API will validate the data and attempt to create a new quack based on the provided information.
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

            // display a success message to the user indicating that the registration was successful. This provides feedback to the user that their account has been created successfully.
            alert("Quack created!");
            
            // Navigate the user to the newly created quack's page using the ID of the created quack returned from the API. This allows the user to see their newly created quack and interact with it (example: view, like, comment, etc.).
            // navigate(`/quacks/${result.id}`);
            navigate(`/`);

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
        // <section className="create-quack-form">

            <form className="create-quack-form" onSubmit={handleSubmit(onSubmit)}>

                <div className="create-quack-form__buttons">
                    <Link to="/" className="create-quack-form__link">
                        Cancel
                    </Link>
                    {/* disable button if no text is provided in textarea or no media is selected */}
                    {/* if button is disabled, set background color to indicate it's not clickable */}
                    <button type="submit" className="create-quack-form__button" disabled={!watch("content") && !watch("media")} style={{ backgroundColor: (!watch("content") && !watch("media")) ? "var.$disable-color" : "var.$primary-link-color" }}>
                        Quack
                    </button>
                </div>

                {errors.content && (
                    <p className="create-quack-form__error">
                        {errors.content.message}
                    </p>
                )}

                <div className="create-quack-form__input-container">
                    <img src={user?.avatar} alt={user?.username} className="create-quack-form__avatar" />
                    <textarea
                        placeholder="What's quackening?"
                        {...register("content")}
                    ></textarea>
                </div>


                {/* set media to a iamge scroller with images from users camera roll */}
                

                {/* media input */}
                {/* is set as array in the data structure */}
                {/* <div className="create-quack-form__media-input">
                    <select name="" id="">
                        <option value="">Select media type</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select> */}
                    <input 
                        {...register("media")}
                        placeholder="Enter media URL"
                    />
                {/* </div> */}
                
                {errors.media && (
                    <p className="create-quack-form__error">
                        {errors.media.message}
                    </p>
                )}
            
            </form>

    )

}