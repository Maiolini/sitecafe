import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Users, 
  UserCheck, 
  Store, 
  ShoppingCart, 
  TrendingUp, 
  CreditCard, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Coffee,
  ArrowRight,
  Eye
} from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const { token } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/dashboard', {
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#651b11] mx-auto mb-4"></div>
            <p className="text-[#785841]">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </AdminLayout>
    )
  }

  const stats = dashboardData?.estatisticas_gerais
  const recentActivity = dashboardData?.atividades_recentes

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#3e2a1b]">
              Dashboard Administrativo
            </h1>
            <p className="text-[#785841] mt-1">
              Visão geral do sistema Café Maiolini
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-[#651b11] text-[#651b11]">
              Última atualização: {new Date().toLocaleTimeString('pt-BR')}
            </Badge>
          </div>
        </div>

        {/* Alertas importantes */}
        {stats?.fornecedores_pendentes > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Existem {stats.fornecedores_pendentes} fornecedores aguardando aprovação.{' '}
              <Link to="/admin/fornecedores" className="underline font-medium">
                Revisar agora
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Cards de estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-[#651b11]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {stats?.total_usuarios || 0}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                {stats?.usuarios_ativos || 0} ativos este mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Clientes Ativos
              </CardTitle>
              <UserCheck className="h-4 w-4 text-[#651b11]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {stats?.total_clientes || 0}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                {stats?.novos_clientes_mes || 0} novos este mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Fornecedores
              </CardTitle>
              <Store className="h-4 w-4 text-[#651b11]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {stats?.total_fornecedores || 0}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                {stats?.fornecedores_pendentes || 0} aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Pedidos (Mês)
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-[#651b11]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {stats?.pedidos_mes || 0}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                {stats?.kg_vendidos_mes || 0} kg vendidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas financeiras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Faturamento (Mês)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#651b11]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {formatCurrency(stats?.faturamento_mes || 0)}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                Ticket médio: {formatCurrency((stats?.faturamento_mes || 0) / (stats?.pedidos_mes || 1))}
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Cashback Pago
              </CardTitle>
              <CreditCard className="h-4 w-4 text-[#651b11]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                {formatCurrency(stats?.cashback_pago_mes || 0)}
              </div>
              <p className="text-xs text-[#785841] mt-1">
                {formatCurrency(stats?.cashback_acumulado_total || 0)} acumulado total
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#785841]">
                Crescimento
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#651b11]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3e2a1b]">
                +{((stats?.crescimento_percentual || 0) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-[#785841] mt-1">
                Comparado ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição por níveis de parceria */}
        <Card className="border-[#ccb38c]">
          <CardHeader>
            <CardTitle className="text-[#3e2a1b] flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Distribuição por Níveis de Parceria
            </CardTitle>
            <CardDescription className="text-[#785841]">
              Quantidade de clientes em cada nível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {stats?.niveis_parceria?.inicial || 0}
                </div>
                <p className="text-sm text-green-600 font-medium">Parceiros Iniciais</p>
                <p className="text-xs text-green-500 mt-1">5kg+ por mês</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {stats?.niveis_parceria?.avancado || 0}
                </div>
                <p className="text-sm text-blue-600 font-medium">Parceiros Avançados</p>
                <p className="text-xs text-blue-500 mt-1">40kg+ por mês</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">
                  {stats?.niveis_parceria?.elite || 0}
                </div>
                <p className="text-sm text-yellow-600 font-medium">Parceiros Elite</p>
                <p className="text-xs text-yellow-500 mt-1">80kg+ por mês</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividades recentes e ações rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Atividades recentes */}
          <Card className="border-[#ccb38c]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#3e2a1b] flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Atividades Recentes
              </CardTitle>
              <Link to="/admin/relatorios">
                <Button variant="ghost" size="sm" className="text-[#785841] hover:text-[#3e2a1b]">
                  Ver tudo <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentActivity?.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((atividade, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[#f2e3ca] rounded-lg">
                      <div className="flex-shrink-0 w-2 h-2 bg-[#651b11] rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#3e2a1b]">
                          {atividade.descricao}
                        </p>
                        <p className="text-xs text-[#785841] mt-1">
                          {formatDate(atividade.data)} - {atividade.usuario}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-[#ccb38c] mx-auto mb-4" />
                  <p className="text-[#785841]">Nenhuma atividade recente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações rápidas */}
          <Card className="border-[#ccb38c]">
            <CardHeader>
              <CardTitle className="text-[#3e2a1b]">Ações Rápidas</CardTitle>
              <CardDescription className="text-[#785841]">
                Acesse rapidamente as principais funcionalidades administrativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/admin/usuarios">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                    <Users className="w-6 h-6" />
                    Gerenciar Usuários
                  </Button>
                </Link>
                
                <Link to="/admin/fornecedores">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                    <Store className="w-6 h-6" />
                    Aprovar Fornecedores
                  </Button>
                </Link>
                
                <Link to="/admin/pedidos">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                    <ShoppingCart className="w-6 h-6" />
                    Ver Pedidos
                  </Button>
                </Link>
                
                <Link to="/admin/relatorios">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-[#785841] text-[#785841] hover:bg-[#785841] hover:text-white">
                    <TrendingUp className="w-6 h-6" />
                    Relatórios
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard

