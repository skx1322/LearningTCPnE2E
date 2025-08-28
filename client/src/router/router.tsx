import { createBrowserRouter } from "react-router";
import Main from "../components/main";
import Home from "../pages/home";
import Register from "../pages/register";
import About from "../pages/about";
import Chat from "../pages/chat";
import Video from "../pages/video";

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
            {
        path: "/video",
        element: <Video />
      },
    ],
  },
]);

export default router;
