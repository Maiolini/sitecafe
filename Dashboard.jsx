import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Coffee, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  Star,
  Gift,
  ShoppingCart,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user, token } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/cliente/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erro ao carregar dados')
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'elite':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 'avancado':
        return 'bg-gradient-to-r from-blue-400 to-blue-600'
      default:
        return 'bg-gradient-to-r from-green-400 to-green-600'
    }
  }

  const getNivelLabel = (nivel) => {
    switch (nivel) {
      case 'elite':
        return 'Parceiro Elite'
      case 'avancado':
        return 'Parceiro Avançado'
      default:
        return 'Parceiro Inicial'
    }
  }

  const getProximoNivel = (nivel) => {
    switch (nivel) {
      case 'inicial':
        return { nome: 'Avançado', meta: 40 }
      case 'avancado':
        return { nome: 'Elite', meta: 80 }
      default:
        return null
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e2a1b] mx-auto mb-4"></div>
            <p className="text-[#785841]">Carregando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const cliente = dashboardData?.cliente
  const stats = dashboardData?.estatisticas_mes
  const proximoNivel = getProximoNivel(cliente?.nivel_parceria)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#3e2a1b]">
              Olá, {user?.nome?.split(' ')[0]}! 👋
            </h1>
            <p className="text-[#785841] mt-1">
              Bem-vindo ao seu painel de controle
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full text-white font-medium ${getNivelColor(cliente?.nivel_parceria)}`}>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                {getNivelLabel(cliente?.nivel_parceria)}
              </div>
            </div>
            <Link to="/novo-pedido">
              <Button className="bg-[#3e2a1b] hover:bg-[#2d1f13] text-[#f2e3ca]">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Novo Pedido
              </Button>
            </Link>
          </div>
        </div>

        {/* Alertas */}
        {stats?.mudou_nivel && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Parabéns! Você evoluiu para o nível {getNivelLabel(cliente?.nivel_parceria)}!
            </AlertDescription>
          </Alert>
        )}

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Café Comprado (Mês)
              </CardTitle>
              <Coffee className="h-4 w-4 text-[#3e2a1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {stats?.total_kg || 0} kg
              </div>
              <p className="text-xs text-[#785841] mt-1">
                {stats?.numero_pedidos || 0} pedidos realizados
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Gasto Total (Mês)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#3e2a1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {formatCurrency(stats?.total_valor || 0)}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                Ticket médio: {formatCurrency((stats?.total_valor || 0) / (stats?.numero_pedidos || 1))}
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Cashback Disponível
              </CardTitle>
              <CreditCard className="h-4 w-4 text-[#3e2a1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {formatCurrency(cliente?.cashback_acumulado || 0)}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                Taxa atual: {((dashboardData?.taxa_cashback_atual || 0) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Benefícios Disponíveis
              </CardTitle>
              <Gift className="h-4 w-4 text-[#3e2a1b]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {dashboardData?.beneficios_disponiveis || 0}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                Fornecedores parceiros
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progresso para próximo nível */}
        {proximoNivel && (
          <Card className="border-[#ccb38c]">
            <CardHeader>
              <CardTitle className="text-[#3e2a1b] flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progresso para {proximoNivel.nome}
              </CardTitle>
              <CardDescription className="text-[#785841]">
                Continue comprando para desbloquear mais benefícios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#785841]">Progresso atual</span>
                  <span className="text-[#3e2a1b] font-medium">
                    {stats?.total_kg || 0} kg / {proximoNivel.meta} kg
                  </span>
                </div>
                
                <div className="w-full bg-[#ccb38c] rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#3e2a1b] to-[#785841] h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((stats?.total_kg || 0) / proximoNivel.meta) * 100, 100)}%` 
                    }}
                  />
                </div>
                
                <p className="text-sm text-[#785841]">
                  Faltam apenas <strong>{Math.max(proximoNivel.meta - (stats?.total_kg || 0), 0)} kg</strong> para o próximo nível!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Próximas entregas e transações recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas entregas */}
          <Card className="border-[#ccb38c]">
            <CardHeader>
              <CardTitle className="text-[#3e2a1b] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Próximas Entregas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.proximas_entregas?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.proximas_entregas.map((entrega, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#f2e3ca] rounded-lg">
                      <div>
                        <p className="font-medium text-[#3e2a1b]">
                          {entrega.quantidade_kg} kg - {entrega.tipo_cafe}
                        </p>
                        <p className="text-sm text-[#785841]">
                          {new Date(entrega.data_entrega).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-[#785841] text-[#785841]">
                        {entrega.automatico ? 'Automático' : 'Manual'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-[#ccb38c] mx-auto mb-4" />
                  <p className="text-[#785841]">Nenhuma entrega programada</p>
                  <Link to="/novo-pedido">
                    <Button variant="outline" className="mt-2 border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                      Fazer Pedido
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Últimas transações de cashback */}
          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#3e2a1b] flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Cashback Recente
              </CardTitle>
              <Link to="/cashback">
                <Button variant="ghost" size="sm" className="text-[#785841] hover:text-[#3e2a1b]">
                  Ver tudo <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {dashboardData?.ultimas_transacoes_cashback?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.ultimas_transacoes_cashback.map((transacao, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#f2e3ca] rounded-lg">
                      <div>
                        <p className="font-medium text-[#3e2a1b]">
                          {transacao.descricao}
                        </p>
                        <p className="text-sm text-[#785841]">
                          {new Date(transacao.data_transacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className={`font-medium ${
                        transacao.tipo === 'ganho' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transacao.tipo === 'ganho' ? '+' : '-'}{formatCurrency(transacao.valor)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-[#ccb38c] mx-auto mb-4" />
                  <p className="text-[#785841]">Nenhuma transação recente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <Card className="border-[#ccb38c]">
          <CardHeader>
            <CardTitle className="text-[#3e2a1b]">Ações Rápidas</CardTitle>
            <CardDescription className="text-[#785841]">
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/novo-pedido">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                  <ShoppingCart className="w-6 h-6" />
                  Fazer Pedido
                </Button>
              </Link>
              
              <Link to="/beneficios">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                  <Gift className="w-6 h-6" />
                  Ver Benefícios
                </Button>
              </Link>
              
              <Link to="/cashback">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                  <CreditCard className="w-6 h-6" />
                  Usar Cashback
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard

