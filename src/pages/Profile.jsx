import { useLoaderData } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header/Header";
import CreateQuackButton from '../components/CreateQuackButton/CreateQuackButton';
import Navigation from "../components/Navigation/Navigation";
import UserProfile from "../components/EditFollowButton/EditFollowButton";


export default function Profile() {

    // get the data of the current logged in user
    // user comes from the useAuth hook, which is used to get the current logged in user and their data
    const { user: loggedInUser, loading } = useAuth();
    // console.log("User Logged in:", loggedInUser);

    // get the user data of the profile being viewed
    // the user data of the profile being viewed is fetched in the userLoader, which is used as a loader for this route in App.jsx
    const { user: viewedUser } = useLoaderData();
    // console.log("Viewing User Profile:", viewedUser);

    // if the user data is still loading, show a loading message
    if (loading) return <p>Loading...</p>;

    // if there is no user data for the profile being viewed, show an error message
    if (!viewedUser) {
        return <p>User not found</p>;
    }

    // check if the profile being viewed has the same id as the currently logged in user
    // save the result (true or false) in a variable called isOwnProfile
    // const isOwnProfile = viewedUser.id === loggedInUser?.id;


    return (
        <section className="profile-page">

            {/* background image for when header is on profile page */}
                {/* background image can be edited in the users "edit profile" - ADD BG IMAGE TO API */}
            {/* LEFT- back button instead of users avatar on left side of header */}
            {/* MIDDLE - hide logo/title */}
            {/* RIGHT - hide settings icon */}
            {/* <Header background={true}  /> */}
            <Header showAvatar={false} />
            
            <main>

                <h1>{viewedUser.name}</h1>
                <h2>@{viewedUser.username}</h2>

                {/* if the viewed user is the same as the logged-in user */}
                <UserProfile userLoggedIn={loggedInUser} viewedUser={viewedUser} />

                {/* blue button to create a new quack */}
                <CreateQuackButton />

            </main>
            
            <Navigation />

        </section>
    );
    
}