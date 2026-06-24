import { Outlet } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import SideMenu from "../components/SideMenu"


const DashboardLayout = () => {
    const { user, logout } = useAuth()

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* barra lateral - menu */}

            <SideMenu />

            {/* Conteúdo principal */}
            <main className="flex-1 flex flex-col">
                <header className="flex justify-between items-center bg-white p-4 shadow">
                    <h1 className="text-xl font-bold text-cyan-800">Painel do Sistema</h1>
                    {
                        user && (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700">Bem Vindo, {user.email}</span>
                                <button
                                    onClick={logout}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Sair

                                </button>

                            </div>
                        )
                    }
                </header>

                {/* Páginas internas do dashboard */}
                <section className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout