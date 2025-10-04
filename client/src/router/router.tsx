import { createBrowserRouter } from "react-router";
import Main from "../components/main";
// import Home from "../pages/home";
// import Register from "../pages/register";
// import About from "../pages/about";
import Chat from "../pages/chat";
import Video from "../pages/video";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Chat />
      },
            {
        path: "/share",
        element: <Video />
      },
    ],
  },
]);

export default router;
