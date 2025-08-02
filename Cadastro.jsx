import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Coffee, Eye, EyeOff, AlertCircle, CheckCircle, User, Store } from 'lucide-react'

const Cadastro = () => {
  const [activeTab, setActiveTab] = useState('cliente')
  const [formData, setFormData] = useState({
    // Dados básicos
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    telefone: '',
    tipo_usuario: 'cliente',
    
    // Dados específicos do cliente
    empresa: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    
    // Dados específicos do fornecedor
    nome_empresa: '',
    categoria: '',
    descricao: '',
    instagram: '',
    site: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleTabChange = (value) => {
    setActiveTab(value)
    setFormData({
      ...formData,
      tipo_usuario: value
    })
    setError('')
    setSuccess('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return false
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return false
    }

    if (activeTab === 'fornecedor' && !formData.nome_empresa) {
      setError('Nome da empresa é obrigatório para fornecedores')
      return false
    }

    if (activeTab === 'fornecedor' && !formData.categoria) {
      setError('Categoria é obrigatória para fornecedores')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    const result = await register(formData)

    if (result.success) {
      setSuccess(result.message)
      
      // Se foi aprovado automaticamente (cliente), redirecionar
      if (result.user.aprovado) {
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        // Fornecedor aguardando aprovação
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2e3ca] to-[#ccb38c] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3e2a1b] rounded-full mb-4">
            <Coffee className="w-8 h-8 text-[#f2e3ca]" />
          </div>
          <h1 className="text-2xl font-bold text-[#3e2a1b]">Café Maiolini</h1>
          <p className="text-[#785841] mt-1">Cadastre-se no Sistema de Parceiros</p>
        </div>

        <Card className="border-[#ccb38c] shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-[#3e2a1b]">Criar nova conta</CardTitle>
            <CardDescription className="text-[#785841]">
              Escolha o tipo de conta e preencha seus dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="cliente" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Cliente
                </TabsTrigger>
                <TabsTrigger value="fornecedor" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Fornecedor
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Dados básicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-[#3e2a1b]">Nome Completo *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      required
                      className="border-[#ccb38c] focus:border-[#785841]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-[#3e2a1b]">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(13) 99999-9999"
                      className="border-[#ccb38c] focus:border-[#785841]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#3e2a1b]">Email *</Label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#3e2a1b]">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#3e2a1b]">Confirmar Senha *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirme sua senha"
                        required
                        className="border-[#ccb38c] focus:border-[#785841] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#785841] hover:text-[#3e2a1b]"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <TabsContent value="cliente" className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold text-[#3e2a1b]">Dados da Empresa</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empresa" className="text-[#3e2a1b]">Nome da Empresa</Label>
                      <Input
                        id="empresa"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        placeholder="Nome da sua empresa"
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-[#3e2a1b]">CNPJ</Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        placeholder="00.000.000/0000-00"
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco" className="text-[#3e2a1b]">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro"
                      className="border-[#ccb38c] focus:border-[#785841]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-[#3e2a1b]">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Santos"
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado" className="text-[#3e2a1b]">Estado</Label>
                      <Input
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        placeholder="SP"
                        maxLength="2"
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cep" className="text-[#3e2a1b]">CEP</Label>
                      <Input
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        placeholder="11000-000"
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fornecedor" className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold text-[#3e2a1b]">Dados do Fornecedor</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_empresa" className="text-[#3e2a1b]">Nome da Empresa *</Label>
                      <Input
                        id="nome_empresa"
                        name="nome_empresa"
                        value={formData.nome_empresa}
                        onChange={handleChange}
                        placeholder="Nome da sua empresa"
                        required={activeTab === 'fornecedor'}
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoria" className="text-[#3e2a1b]">Categoria *</Label>
                      <Input
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        placeholder="Ex: Ovos, Salgados, Pães"
                        required={activeTab === 'fornecedor'}
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao" className="text-[#3e2a1b]">Descrição</Label>
                    <Textarea
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      placeholder="Descreva seus produtos e serviços"
                      className="border-[#ccb38c] focus:border-[#785841]"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-[#3e2a1b]">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="@seuinstagram"
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site" className="text-[#3e2a1b]">Site</Label>
                      <Input
                        id="site"
                        name="site"
                        value={formData.site}
                        onChange={handleChange}
                        placeholder="https://seusite.com"
                        className="border-[#ccb38c] focus:border-[#785841]"
                      />
                    </div>
                  </div>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Contas de fornecedor precisam ser aprovadas pelo administrador antes de serem ativadas.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3e2a1b] hover:bg-[#2d1f13] text-[#f2e3ca] mt-6"
                >
                  {loading ? 'Cadastrando...' : 'Criar Conta'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <div className="text-[#785841] text-sm">
                  Já tem uma conta?{' '}
                  <Link
                    to="/login"
                    className="text-[#3e2a1b] hover:underline font-medium"
                  >
                    Faça login aqui
                  </Link>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-[#785841] hover:text-[#3e2a1b] text-sm underline"
          >
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cadastro

