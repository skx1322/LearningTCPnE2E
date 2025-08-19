import { createBrowserRouter } from "react-router";
import Main from "../components/main";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import About from "../pages/about";
import Chat from "../pages/chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/chat",
        element: <Chat />
      },
    ],
  },
]);

export default router;
