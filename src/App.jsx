import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { AdminProvider } from "./context/AdminContext";
import { Routes } from "./routes/Routes";



function App() {
  return (
    <>
      <AuthProvider>
        <AdminProvider>
          <RouterProvider router={Routes} />
        </AdminProvider>
      </AuthProvider>

    </>
  )
}

export default App
