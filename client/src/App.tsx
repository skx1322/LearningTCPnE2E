import { RouterProvider } from "react-router"
import router from "./router/router"

function App() {
  return (
    <div className="min-h-screen font-main backdrop-blur-3xl bg-secondary/30 bg-cover bg-center">
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
