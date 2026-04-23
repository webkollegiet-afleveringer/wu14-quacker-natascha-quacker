import { useEffect, useState } from "react";


export const useCurrentUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            const res = await fetch("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setUser(data.user);
        };

        fetchUser();
    }, []);

    return user;
};