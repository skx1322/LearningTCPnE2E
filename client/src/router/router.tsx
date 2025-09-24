import { createBrowserRouter } from "react-router";
import Main from "../components/main";
// import Home from "../pages/home";
// import Register from "../pages/register";
// import About from "../pages/about";
import Chat from "../pages/chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Chat />
      },
    ],
  },
]);

export default router;
