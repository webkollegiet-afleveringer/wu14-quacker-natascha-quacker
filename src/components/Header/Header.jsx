import './Header.sass';


// WelcomeMessage component that takes in isLoggedIn and user as props and displays a welcome message if the user is logged in, or a prompt to log in if they are not
// Maybe add this const to a props file and import it where I need to check for a user
// const WelcomeMessage = (props) => {
//     const { isLoggedIn, user } = props;
//     return (<div>
//         {isLoggedIn ? <h2>Welcome back, {user}!</h2> :
//         <p>Please log in to continue </p>
//         }
//     </div>)
// }


export default function Header() {

    // maybe get username from api user.username
    const user = "John";
    // check if user is logged in, maybe by getting a bearer token when creating a user and seeing if token is present in local storage or something like that
    const isLoggedIn = true;

    return (
        <header className="header">
            {/* <WelcomeMessage user={user} isLoggedIn={isLoggedIn} /> */}
        </header>
    )

}