import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { loginStart, loginSuccess, loginFailure, logout } from '@/features/auth/authSlice'
import axios from '@/lib/axios'

export const useAuth = () => {
  const dispatch = useDispatch()

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      dispatch(loginStart())
      const { data } = await axios.post('/auth/admin-login', credentials)
      console.log(data)
      dispatch(loginSuccess(data))
      return data
    },
    onError: (error) => {
      const message = error?.response?.data?.msg || 'Login failed'
      dispatch(loginFailure(message))
    }
  })

  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/auth/register', payload)
      return data
    }
  })

  const signOut = () => {
    dispatch(logout())
  }

  return {
    login: async (credentials) => {
      try {
        const data = await loginMutation.mutateAsync(credentials)
        return { success: true, data }
      } catch (err) {
        return {
          success: false,
          message: err?.response?.data?.message || 'Login failed'
        }
      }
    },
    register: async (payload) => {
      try {
        const data = await registerMutation.mutateAsync(payload)
        return { success: true, data }
      } catch (err) {
        return {
          success: false,
          message: err?.response?.data?.message || 'Registration failed'
        }
      }
    },
    signOut,
    isLoading: loginMutation.isPending || registerMutation.isPending
  }
}
