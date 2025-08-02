import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Coffee, Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Token de recuperação não encontrado')
      setValidatingToken(false)
      return
    }

    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/validate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      const data = await response.json()

      if (data.valid) {
        setTokenValid(true)
        setUserEmail(data.email)
      } else {
        setError(data.message || 'Token inválido ou expirado')
      }
    } catch (error) {
      console.error('Erro ao validar token:', error)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setValidatingToken(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Validações
    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token,
          password 
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(data.message)
        
        // Redireciona para login após 3 segundos
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setError(data.message || 'Erro ao redefinir senha')
      }
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-[#f2e3ca] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#ccb38c]">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#651b11] mx-auto mb-4"></div>
              <p className="text-[#785841]">Validando token...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#f2e3ca] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#ccb38c]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-[#3e2a1b]">Token Inválido</CardTitle>
            <CardDescription className="text-[#785841]">
              O link de recuperação não é válido ou expirou
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <Link to="/forgot-password">
                <Button className="w-full bg-[#3e2a1b] hover:bg-[#785841] text-[#f2e3ca]">
                  Solicitar Novo Link
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="w-full border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f2e3ca] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#ccb38c]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-[#3e2a1b]">Senha Alterada!</CardTitle>
            <CardDescription className="text-[#785841]">
              Sua senha foi redefinida com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>

            <div className="text-center text-sm text-[#785841]">
              <p>Você será redirecionado para o login em alguns segundos...</p>
            </div>

            <div className="flex justify-center">
              <Link to="/login">
                <Button className="bg-[#3e2a1b] hover:bg-[#785841] text-[#f2e3ca]">
                  Ir para Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f2e3ca] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#ccb38c]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Coffee className="w-12 h-12 text-[#651b11]" />
          </div>
          <CardTitle className="text-2xl text-[#3e2a1b]">Redefinir Senha</CardTitle>
          <CardDescription className="text-[#785841]">
            Digite sua nova senha para {userEmail}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#3e2a1b]">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#ccb38c] focus:border-[#785841] pr-10"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-[#785841]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#785841]" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#3e2a1b]">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-[#ccb38c] focus:border-[#785841] pr-10"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-[#785841]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#785841]" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#3e2a1b] hover:bg-[#785841] text-[#f2e3ca]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f2e3ca]"></div>
                  Alterando Senha...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Alterar Senha
                </div>
              )}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-[#785841] hover:text-[#3e2a1b] flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword

