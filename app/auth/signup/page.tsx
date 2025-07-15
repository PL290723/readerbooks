'use client'

import { useState, useEffect } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [providers, setProviders] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    loadProviders()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Cuenta creada exitosamente')
        // Intentar iniciar sesión automáticamente
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          router.push('/auth/signin')
        } else {
          router.push('/')
        }
      } else {
        toast.error(data.message || 'Error al crear la cuenta')
      }
    } catch (error) {
      toast.error('Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Crear cuenta</h2>
            <p className="text-white/80">Únete a nuestro sistema de gestión de libros</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1">
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      className="h-5 w-5 text-white/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg
                      className="h-5 w-5 text-white/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/80">O continúa con</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {providers && Object.values(providers).map((provider: any) => {
                  if (provider.id === 'credentials') return null
                  return (
                    <button
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                      className="w-full inline-flex justify-center py-2 px-4 border border-white/30 rounded-md shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20"
                    >
                      {provider.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="text-center">
              <span className="text-white/80">¿Ya tienes una cuenta? </span>
              <Link href="/auth/signin" className="font-medium text-blue-400 hover:text-blue-300">
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}