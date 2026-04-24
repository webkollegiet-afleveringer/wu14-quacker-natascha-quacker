// This hook is used to fetch the current user data from the backend when the component mounts.
// It checks for a token in localStorage, and if it exists, it makes a request to the backend to get the user data.
// The user data is then stored in the state and returned to any component that uses this hook.

import { useEffect, useState } from "react";


export const useCurrentUser = () => {

    // this is a simple implementation, it can be customized according to my needs, - handling errors or updating user data when the token changes.

    // Note that this hook only fetches user data once when the component mounts. If I need to update user data dynamically, I can consider using a global state management solution like Context API or Redux.

    // I can add this logic to useAuth hook, so I have everything related to authentication in one place. This way, I can easily manage user data and authentication state across my application without needing to create a separate hook for fetching the current user.
    
    // Remember to make an endpoint in backend for fetching current user data, and ensure that it requires authentication
    // it should check for a valid token in the request header and return user data if the token is valid.

    // If i use a global state management solution, I can update user data in the global state, so all components that use this data will automatically update when user data changes.

    // I can maybe handle token expiration by checking the token's validity in the useEffect hook, and if the token is expired, I can clear the user data and token from localStorage, effectively logging the user out.


    // useState to save user data
    // user is the current user data
    // setUser is the function to update it
    const [user, setUser] = useState(null);

    useEffect(() => {
        
        // const to save the user data in state
        const fetchUser = async () => {
            // get token in localStorage
            const token = localStorage.getItem("token");

            // if no token, return early
            if (!token) return;

            // fetch user data from backend
            const res = await fetch("/users/me", {
                headers: {
                    // send token in Authorization header
                    Authorization: `Bearer ${token}`
                }
            });

            // if response is not ok, return early (optional: you can also handle errors here)
            if (!res.ok) return;

            // parse response data and set user state
            const data = await res.json();
            
            // set user data in state
            setUser(data.user);
        };

        // call fetchUser function to get current user data
        fetchUser();
    }, []);

    // return current user data to components that use this hook
    return user;
};