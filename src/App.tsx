import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { MainRoute } from "./routes/main"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRoute />
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
