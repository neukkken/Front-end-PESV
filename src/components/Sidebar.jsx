import { Home, DollarSign, Settings, Share2, Menu, ChevronRight, Users, Car, LogOut, DnaOffIcon, FileStack, BookPlusIcon, ListCheck, FilePlus } from "lucide-react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavItem = ({ icon, label, isActive, isExpanded, onClick, subItems, route }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    let timer
    if (isExpanded) {
      timer = setTimeout(() => setShowLabel(true), 150)
    } else {
      setShowLabel(false)
    }
    return () => clearTimeout(timer)
  }, [isExpanded])

  const handleClick = () => {
    if (subItems && !isExpanded) {
      onClick && onClick()
    } else if (subItems) {
      setIsSubMenuOpen(!isSubMenuOpen)
    } else {
      onClick && onClick()
    }
  }

  return (
    <div>
      {/* Solo hacer el link si no hay subitems */}
      {subItems ? (
        <button
          onClick={handleClick}
          className={`w-full p-4 transition-all duration-300 flex items-center gap-4 ${
            isActive ? "text-green-300 bg-green-800/30 hover:bg-green-800/50" : "text-white hover:bg-green-800/30"
          }`}
        >
          <div
            className={`flex justify-center items-center rounded-full transition-all duration-300 ${
              isExpanded ? "w-6 h-6" : "w-5 h-5"
            }`}
          >
            {icon}
          </div>
          {isExpanded && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showLabel ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
              }`}
            >
              <span className="text-sm whitespace-nowrap">{`${label}`}</span>
            </div>
          )}
          {isExpanded && subItems && (
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ml-auto ${
                isSubMenuOpen ? "rotate-90" : ""
              }`}
            />
          )}
        </button>
      ) : (
        <Link
          to={route}
          onClick={handleClick}
          className={`w-full p-4 transition-all duration-300 flex items-center gap-4 ${
            isActive ? "text-green-300 bg-green-800/30 hover:bg-green-800/50" : "text-white hover:bg-green-800/30"
          }`}
        >
          <div
            className={`flex justify-center items-center rounded-full transition-all duration-300 ${
              isExpanded ? "w-6 h-6" : "w-5 h-5"
            }`}
          >
            {icon}
          </div>
          {isExpanded && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showLabel ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
              }`}
            >
              <span className="text-sm whitespace-nowrap">{`${label}`}</span>
            </div>
          )}
        </Link>
      )}
      {isExpanded && isSubMenuOpen && subItems && (
        <div className="ml-8 space-y-1 transition-all ease-in-out duration-300">
          {subItems.map((item, index) => (
            <Link 
              to={item.route} 
              key={index}
              className="block w-full"
            >
              <div
                onClick={item.onClick}
                className="w-full text-left text-sm py-3 px-4 hover:bg-green-800/40 transition-colors rounded-md flex items-center gap-2 hover:text-green-300"
              >
                {/* Ícono antes del texto */}
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const Sidebar = () => {
  const { logOut } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarExpanded")
      return saved !== null ? JSON.parse(saved) : false
    }
    return false
  })
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(isExpanded))
  }, [isExpanded])

  useEffect(() => {
    let timer
    if (isExpanded) {
      timer = setTimeout(() => setShowTitle(true), 150)
    } else {
      setShowTitle(false)
    }
    return () => clearTimeout(timer)
  }, [isExpanded])

  const navItems = [
    { icon: <Home className="w-full h-full transition-all duration-300" />, label: "Home", route: "/admin" },
    {
      icon: <Users className="w-full h-full transition-all duration-300" />,
      label: "Gestión de Usuarios",
      route: "/admin/gestion-usuarios",
    },
    {
      icon: <FileStack className="w-full h-full transition-all duration-300" />,
      label: "Documentos",
      route: "/admin/documentos",
    },
    {
      icon: <Car className="w-full h-full transition-all duration-300" />,
      label: "Gestión de Vehiculos",
      route: "/admin/gestion-vehiculos",
    },
    {
      icon: <Settings className="w-full h-full transition-all duration-300" />,
      label: "Configuración",
      subItems: [
        { icon: <FilePlus className="w-5 h-5 transition-all duration-300" />, label: "Gestión Formularios", route: "/admin/configuracion/gestion-forms" },
        { icon: <ListCheck className="w-5 h-5 transition-all duration-300" />, label: "Gestión Pesv", route: "/admin/configuracion/gestion-pesv" },
      ],
    }
  ]

  const handleItemClick = (index) => {
    setActiveIndex(index)
    if (navItems[index].subItems && !isExpanded) {
      setIsExpanded(true)
    }
  }

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div
      className={`h-screen bg-[#004d25] text-white flex flex-col transition-all duration-300 ${isExpanded ? "w-64" : "w-14"}`}
    >
      <div className="flex items-center p-4 hover:bg-green-800/30 transition-colors cursor-pointer">
        <button onClick={toggleSidebar} className="flex items-center justify-center w-6 h-6">
          <Menu className={`transition-all duration-300 ${isExpanded ? "w-6 h-6" : "w-5 h-5"}`} />
        </button>
        {isExpanded && (
          <div
            className={`overflow-hidden transition-all duration-300 ${showTitle ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
          >
            <span className="ml-4 text-sm font-bold whitespace-nowrap">PESV</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col mt-5">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            label={item.label}
            route={item.route}
            isActive={activeIndex === index}
            isExpanded={isExpanded}
            onClick={() => handleItemClick(index)}
            subItems={item.subItems}
          />
        ))}
      </div>

      <div className="border-t border-green-800/50 mt-2 pt-2">
        <Link 
          to={'/login'} 
          onClick={logOut} 
          className="flex items-center p-4 hover:bg-green-800/30 transition-colors gap-4 w-full"
        >
          <div className="flex items-center justify-center w-6 h-6">
            <LogOut className={`transition-all duration-300 ${isExpanded ? "w-6 h-6" : "w-5 h-5"}`} />
          </div>
          {isExpanded && (
            <div
              className={`overflow-hidden transition-all duration-300 ${showTitle ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
            >
              <span className="text-sm whitespace-nowrap">Cerrar la sesión</span>
            </div>
          )}
        </Link>
      </div>
    </div>
  )
}

export default Sidebar