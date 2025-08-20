import { RouterProvider } from "react-router"
import router from "./router/router"

function App() {
  return (
    <div className="min-h-screen font-main backdrop-blur-3xl bg-main bg-cover bg-center bg-[url(https://nerdantabucket0.sgp1.cdn.digitaloceanspaces.com/test/FuHua9.jpg)]">
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
