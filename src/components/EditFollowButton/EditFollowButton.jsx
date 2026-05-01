// Component to show on Profile.jsx when a user is logged in and viewing their own profile page.
import './EditFollowButton.sass';
import CreateQuackButton from '../CreateQuackButton/CreateQuackButton';


export default function EditFollowButton({ userLoggedIn, viewedUser }) {

    return (
        <section className="edit-follow-button">

            {/* EDIT BUTTON */}
            {/* this button if a user is the owner of the profile being viewed */}
            {userLoggedIn && viewedUser && userLoggedIn.id === viewedUser.id && (
                <button className="edit-follow-button__edit">Edit Profile</button>
            )}

            {/* this button if a user is not the owner of the profile being viewed */}
            {userLoggedIn && viewedUser && userLoggedIn.id !== viewedUser.id && (
                <button className="edit-follow-button__follow">Follow</button>
            )}
            {/* if a user is not the owner of the profile being viewed, but already follows them, make the button say "Unfollow" */}
            {/* {userLoggedIn && viewedUser && userLoggedIn.id !== viewedUser.id && (
                <button className="edit-follow-button__unfollow">Unfollow</button>
            )} */}

            {/* <h1>This is your profile page. Here you can edit your profile and create new quacks.</h1> */}
            
        </section>
    );

}