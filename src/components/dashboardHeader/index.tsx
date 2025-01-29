import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { toast } from "react-toastify";

export function DashboardHeader() {

    async function handleLogout() {
        await signOut(auth);
        toast.success("Até breve!");
    }

    return(
        <div className="w-full bg-zinc-500 p-3 rounded-lg flex gap-7 text-white mb-4">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/dashboard/new">Cadastrar Veículo</Link>
            <button className="ml-auto cursor-pointer" onClick={handleLogout}>Sair</button>
        </div>
    )
}