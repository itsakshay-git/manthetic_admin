import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute() {
  const { token, user } = useSelector((state) => state.auth)

  if (!token || !user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}