import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validation/authSchemas'
import { useAuth } from '@/hooks/auth/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data) => {
    const res = await login(data)
    if (res.success) {
      navigate('/dashboard')
      toast.success("logged in successfully")
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-200 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl min-h-[500px] bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Brand Section - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-black" style={{ fontFamily: "'Italiana', sans-serif" }}>
            Manthetic.
          </h1>
          <p className="mt-4 text-sm lg:text-base text-black max-w-xs lg:max-w-none">
            Where Fashion Meets Function for Men
          </p>
        </div>

        {/* Login Form - Full width on mobile, half on desktop */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 bg-red-200 p-6 lg:p-8 flex flex-col justify-center space-y-4"
        >
          <h2 className="text-xl lg:text-2xl font-semibold mb-6 text-center">Login</h2>

          <div className="space-y-3">
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className="w-full p-3 lg:p-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                {...register('password')}
                className="w-full p-3 lg:p-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-black hover:bg-pink-500 text-white font-semibold py-3 lg:py-2 rounded transition-all text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
