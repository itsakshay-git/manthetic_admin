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
    if (res.success){
      navigate('/dashboard')
      toast.success("logged in successfully")
    } else {
      toast.error(res.message)
    } 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-200">
      <div className="flex w-full max-w-4xl h-[500px] bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="w-1/2 p-8">
          <h1 className="text-6xl font-semibold text-black" style={{ fontFamily: "'Italiana', sans-serif" }}>Manthetic.</h1>
          <p className="mt-4 text-sm text-black">
            Where Fashion Meets Function for Men
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-1/2 bg-red-200 p-8 flex flex-col justify-center"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>

          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="mb-3 p-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register('password')}
            className="mb-3 p-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-black hover:bg-pink-500 text-white font-semibold py-2 rounded transition-all"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
