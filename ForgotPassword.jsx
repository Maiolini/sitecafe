import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Coffee, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!email) {
      setError('Por favor, digite seu email')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setEmailSent(true)
        
        // Em desenvolvimento, mostra o token
        if (data.debug_token) {
          setMessage(data.message + ` (Token de desenvolvimento: ${data.debug_token})`)
        }
      } else {
        setError(data.message || 'Erro ao processar solicitação')
      }
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#f2e3ca] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#ccb38c]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-[#3e2a1b]">Email Enviado!</CardTitle>
            <CardDescription className="text-[#785841]">
              Verifique sua caixa de entrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>

            <div className="text-center text-sm text-[#785841]">
              <p>Não recebeu o email? Verifique sua pasta de spam ou</p>
              <Button 
                variant="link" 
                className="text-[#3e2a1b] p-0 h-auto"
                onClick={() => {
                  setEmailSent(false)
                  setMessage('')
                  setError('')
                }}
              >
                tente novamente
              </Button>
            </div>

            <div className="flex justify-center pt-4">
              <Link to="/login">
                <Button variant="outline" className="border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
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

  return (
    <div className="min-h-screen bg-[#f2e3ca] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#ccb38c]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Coffee className="w-12 h-12 text-[#651b11]" />
          </div>
          <CardTitle className="text-2xl text-[#3e2a1b]">Esqueceu sua senha?</CardTitle>
          <CardDescription className="text-[#785841]">
            Digite seu email para receber instruções de recuperação
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
              <Label htmlFor="email" className="text-[#3e2a1b]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#ccb38c] focus:border-[#785841]"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#3e2a1b] hover:bg-[#785841] text-[#f2e3ca]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f2e3ca]"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Enviar Instruções
                </div>
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-[#785841]">
                Lembrou da senha?{' '}
                <Link to="/login" className="text-[#3e2a1b] hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
              
              <Link to="/" className="text-sm text-[#785841] hover:text-[#3e2a1b] flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o site
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword

