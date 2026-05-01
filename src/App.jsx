import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Error from "./pages/Error";
import quacksLoader from "./loaders/quacksLoader";
import Profile from "./pages/Profile";
import userLoader from "./loaders/userLoader";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateQuack from "./pages/CreateQuack";


export default function App() {

  const browserRouter = createBrowserRouter(
    [
      {
        path: '/',
        element: <Home />,
        loader: quacksLoader,
        hydrateFallbackElement: <p>Loading quacks...</p>
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/notifications',
        element: <Notifications />,
      },
      {
        path: '/messages',
        element: <Messages />,
      },
      {
        path: '/users/:id',
        element: <Profile />,
        loader: userLoader,
        hydrateFallbackElement: <p>Loading profile...</p>
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/create-quack',
        element: <CreateQuack />,
      },
      {
        path: '*',
        element: <Error />
      }
    ],
    {
      basename: "/wu14-quacker-natascha-quacker/"
    }
  );

  return (
    <RouterProvider router={browserRouter} />
  )

}