import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Error from "./pages/Error";

import usersLoader from "./loaders/usersLoader";
import quacksLoader from "./loaders/quacksLoader";


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