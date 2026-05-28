// This file defines the AuthContext and the AuthProvider component, which manages the authentication state of the user.
// It provides a login function to set the user data and token in localStorage, and a logout function to clear the user data and token from localStorage.
// The useAuth hook allows any component to access the authentication state and functions provided by the AuthContext.

import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // user state to store the current user data, it will be null if no user is logged in
    // setUser is the function to update the user state, it will be called when the user logs in or logs out to update the authentication state across the application
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    // useEffect to check for user data in localStorage when the component mounts, and set the user state accordingly. This allows the application to persist the user's authentication state across page refreshes.
    useEffect(() => {
        const fetchMe = async () => {
            const token = localStorage.getItem("token");
            // console.log("TOKEN:", token);

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    "https://natascha-quacker-api.onrender.com/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) {
                    throw new Error("Invalid token");
                }

                // console.log("ME STATUS:", res.status);

                const data = await res.json();
                // console.log("ME DATA:", data);

                setUser(data.user);

            }
            catch (error) {
                // console.log("ME ERROR:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);

    // login function to set the user data and token in localStorage, and update the user state. This function will be called when the user successfully logs in.
    const login = (userData, token) => {
        // store user data in localStorage as a string
        localStorage.setItem("user", JSON.stringify(userData));
        // store token in localStorage
        localStorage.setItem("token", token);
        // update user state with the logged in user data
        // this will trigger a re-render of any components that consume the AuthContext, allowing them to update their UI based on the new authentication state.
        setUser(userData);
    };

    // logout function to clear the user data and token from localStorage, and set the user state to null. This function will be called when the user logs out.
    const logout = () => {
        // clear user data and token from localStorage
        localStorage.removeItem("user");
        // clear token from localStorage
        localStorage.removeItem("token");
        // set user state to null to indicate that no user is currently logged in
        setUser(null);
    };

    // provide the user data and authentication functions (login and logout) to any components that consume the AuthContext. This allows components to access the current authentication state and perform login/logout actions as needed.
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);