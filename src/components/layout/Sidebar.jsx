import { NavLink, useNavigate } from "react-router-dom";
import { sidebarLinks } from "@/lib/constants";
import { useAuth } from "@/hooks/auth/useAuth";
import { LogOut } from "lucide-react";

export default function Sidebar({ onLinkClick }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r shadow-sm">
      <div className="flex items-center gap-2 p-4 pl-8 border-b">
        <h1
          className="text-2xl font-bold tracking-wider"
          style={{ fontFamily: "'Italiana', sans-serif" }}
        >
          Manthetic
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-all ${
                isActive ? "bg-green-100 font-semibold" : ""
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-left rounded-md text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
