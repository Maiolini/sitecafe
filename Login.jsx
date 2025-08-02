import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Coffee, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)

    if (result.success) {
      // Redirecionar baseado no tipo de usuário
      if (result.user.tipo_usuario === 'cliente') {
        navigate('/dashboard')
      } else if (result.user.tipo_usuario === 'fornecedor') {
        navigate('/fornecedor/dashboard')
      } else if (result.user.tipo_usuario === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate(from)
      }
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2e3ca] to-[#ccb38c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3e2a1b] rounded-full mb-4">
            <Coffee className="w-8 h-8 text-[#f2e3ca]" />
          </div>
          <h1 className="text-2xl font-bold text-[#3e2a1b]">Café Maiolini</h1>
          <p className="text-[#785841] mt-1">Sistema de Parceiros</p>
        </div>

        <Card className="border-[#ccb38c] shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-[#3e2a1b]">Entrar na sua conta</CardTitle>
            <CardDescription className="text-[#785841]">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#3e2a1b]">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="border-[#ccb38c] focus:border-[#785841]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#3e2a1b]">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Sua senha"
                    required
                    className="border-[#ccb38c] focus:border-[#785841] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#785841] hover:text-[#3e2a1b]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3e2a1b] hover:bg-[#2d1f13] text-[#f2e3ca]"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Link to="/forgot-password" className="text-sm text-[#785841] hover:text-[#3e2a1b]">
                Esqueceu sua senha?
              </Link>
              
              <p className="text-sm text-[#785841]">
                Não tem uma conta?{' '}
                <Link to="/cadastro" className="text-[#3e2a1b] hover:underline font-medium">
                  Cadastre-se aqui
                </Link>
              </p>
              
              <Link to="/" className="text-sm text-[#785841] hover:text-[#3e2a1b] flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login

