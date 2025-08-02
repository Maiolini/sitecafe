import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.jsx'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx'
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash2,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Store,
  Shield,
  Calendar,
  Mail,
  Phone
} from 'lucide-react'

const Usuarios = () => {
  const { token } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('todos')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDialog, setShowUserDialog] = useState(false)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsuarios(data.usuarios)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erro ao carregar usuários')
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/usuarios/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        await fetchUsuarios() // Recarregar lista
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erro ao alterar status')
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      setError('Erro de conexão')
    }
  }

  const handleApproveUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/usuarios/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        await fetchUsuarios() // Recarregar lista
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erro ao aprovar usuário')
      }
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error)
      setError('Erro de conexão')
    }
  }

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'todos' || usuario.tipo_usuario === filterType
    
    return matchesSearch && matchesFilter
  })

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'admin':
        return <Shield className="w-4 h-4" />
      case 'fornecedor':
        return <Store className="w-4 h-4" />
      default:
        return <UserCheck className="w-4 h-4" />
    }
  }

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Administrador</Badge>
      case 'fornecedor':
        return <Badge className="bg-blue-100 text-blue-800">Fornecedor</Badge>
      default:
        return <Badge className="bg-green-100 text-green-800">Cliente</Badge>
    }
  }

  const getStatusBadge = (ativo, aprovado) => {
    if (!aprovado) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pendente</Badge>
    }
    if (ativo) {
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    }
    return <Badge variant="outline" className="border-red-500 text-red-700">Inativo</Badge>
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
            <p className="text-[#785841]">Carregando usuários...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#3e2a1b] flex items-center gap-2">
              <Users className="w-8 h-8" />
              Gerenciamento de Usuários
            </h1>
            <p className="text-[#785841] mt-1">
              Gerencie todos os usuários do sistema
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtros e busca */}
        <Card className="border-[#ccb38c]">
          <CardHeader>
            <CardTitle className="text-[#3e2a1b]">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-[#3e2a1b]">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#785841] w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[#ccb38c] focus:border-[#785841]"
                  />
                </div>
              </div>

              <div className="lg:w-48">
                <Label htmlFor="filter" className="text-[#3e2a1b]">Tipo de Usuário</Label>
                <select
                  id="filter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ccb38c] rounded-md focus:border-[#785841] focus:outline-none"
                >
                  <option value="todos">Todos</option>
                  <option value="cliente">Clientes</option>
                  <option value="fornecedor">Fornecedores</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de usuários */}
        <Card className="border-[#ccb38c]">
          <CardHeader>
            <CardTitle className="text-[#3e2a1b]">
              Usuários ({filteredUsuarios.length})
            </CardTitle>
            <CardDescription className="text-[#785841]">
              Lista de todos os usuários cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#3e2a1b] rounded-full flex items-center justify-center text-[#f2e3ca] font-medium">
                            {usuario.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#3e2a1b]">{usuario.nome}</p>
                            <p className="text-sm text-[#785841]">{usuario.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoIcon(usuario.tipo_usuario)}
                          {getTipoBadge(usuario.tipo_usuario)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(usuario.ativo, usuario.aprovado)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-[#785841]">
                          <Calendar className="w-4 h-4" />
                          {formatDate(usuario.data_criacao)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(usuario)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Usuário</DialogTitle>
                                <DialogDescription>
                                  Informações detalhadas do usuário
                                </DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#3e2a1b] rounded-full flex items-center justify-center text-[#f2e3ca] font-medium text-lg">
                                      {selectedUser.nome.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium text-[#3e2a1b]">{selectedUser.nome}</p>
                                      {getTipoBadge(selectedUser.tipo_usuario)}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[#785841]">
                                      <Mail className="w-4 h-4" />
                                      {selectedUser.email}
                                    </div>
                                    {selectedUser.telefone && (
                                      <div className="flex items-center gap-2 text-[#785841]">
                                        <Phone className="w-4 h-4" />
                                        {selectedUser.telefone}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 text-[#785841]">
                                      <Calendar className="w-4 h-4" />
                                      Cadastrado em {formatDate(selectedUser.data_criacao)}
                                    </div>
                                  </div>

                                  <div className="pt-4 border-t">
                                    <p className="text-sm font-medium text-[#3e2a1b] mb-2">Status:</p>
                                    {getStatusBadge(selectedUser.ativo, selectedUser.aprovado)}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {!usuario.aprovado && usuario.tipo_usuario === 'fornecedor' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApproveUser(usuario.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(usuario.id, usuario.ativo)}
                            className={usuario.ativo ? 
                              "text-red-600 hover:text-red-700 hover:bg-red-50" : 
                              "text-green-600 hover:text-green-700 hover:bg-green-50"
                            }
                          >
                            {usuario.ativo ? (
                              <Trash2 className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredUsuarios.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-[#ccb38c] mx-auto mb-4" />
                  <p className="text-[#785841]">Nenhum usuário encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Usuarios

