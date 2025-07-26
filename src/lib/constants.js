import { LayoutDashboard, ShoppingBag, Package, Users, Star } from "lucide-react"

export const sidebarLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: ShoppingBag },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/reviews", label: "Reviews", icon: Star },
];
