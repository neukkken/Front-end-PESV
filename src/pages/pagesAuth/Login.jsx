import { useState, useEffect } from "react"

import { CloudHail, Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import { TableSkeleton } from "../../components/ui/SkeletonTable";


const Login = () => {
    const navigate = useNavigate();
    const { signIn, loginErrors, isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = handleSubmit(async (values) => {
        try {
            setLoading(true); // Activa el loader antes de la petición
            const responseLogin = await signIn(values);
            // Aquí puedes manejar la respuesta, por ejemplo:
            if (responseLogin.status == 200) {
                navigate("/")
            }
        } catch (error) {
            console.error("Error en login:", error);
        } finally {
            setLoading(false); // Se ejecuta siempre, incluso si hay error
        }
    });

    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            {/* Left side - Login Form */}
            <div className="flex items-center justify-center px-4 border m-5 rounded-lg">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="m-auto h-12 w-12 rounded-full bg-blue-100 p-2 ">
                        <img src={`./img/logo_efagram.png`} alt="logoLogin" className=" m-auto h-full object-contain scale-150" />

                    </div>

                    {/* Welcome Text */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Bienvenido PESV!</h2>
                        <p className="mt-2 text-sm text-gray-600">

                            <a
                                className="text-primary hover:text-blue-600">
                                Empieza Ahora
                            </a>
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Correo"
                                    {...register("email", { required: true })}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    {...register("password", { required: true })}
                                    className="w-full rounded-xl border  border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {loginErrors && loginErrors.map((error, index) => (
                            <div className="mb-4 bg-red-500 text-white rounded-lg p-3 transition-opacity duration-500 ease-in-out transform" key={index}>
                                {error}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-lg ${loading ? 'bg-gray-500' : 'bg-primary'}  h-10 text-white  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center transition-all hover:scale-105 `}
                        >
                            {loading ? <Loader /> : <p className="p-0">Inicia sesión</p>}

                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500 hover:scale-150 transition-shadow cursor-progress"> || </span>
                            </div>
                        </div>


                    </form>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block bg-cover bg-center" style={{ backgroundImage: "url('./img/fondo.jpg')" }}>
                {/* You can replace 'your-image-url.jpg' with the actual image URL you want to use */}

                
            </div>
        </div>
    )
}

export default Login;
