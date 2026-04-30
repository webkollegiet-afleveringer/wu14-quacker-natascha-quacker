import { useLoaderData } from "react-router";
import { useAuth } from "../hooks/useAuth";


export default function Profile() {

    const { user } = useAuth();

    // show the profile page of the user whos id is in the url
    const { id } = useLoaderData();


    return (
        <div>
            {/* <h1>{user?.name}</h1> */}
            <h2>{id}</h2>
        </div>
    )
    
}