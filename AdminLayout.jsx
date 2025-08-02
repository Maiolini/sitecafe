import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { 
  Coffee, 
  Home, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu,
  X,
  BarChart3,
  UserCheck,
  Store,
  FileText,
  Shield
} from 'lucide-react'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home
    },
    {
      name: 'Usuários',
      href: '/admin/usuarios',
      icon: Users
    },
    {
      name: 'Clientes',
      href: '/admin/clientes',
      icon: UserCheck
    },
    {
      name: 'Fornecedores',
      href: '/admin/fornecedores',
      icon: Store
    },
    {
      name: 'Pedidos',
      href: '/admin/pedidos',
      icon: ShoppingCart
    },
    {
      name: 'Cashback',
      href: '/admin/cashback',
      icon: CreditCard
    },
    {
      name: 'Relatórios',
      href: '/admin/relatorios',
      icon: BarChart3
    },
    {
      name: 'Configurações',
      href: '/admin/configuracoes',
      icon: Settings
    }
  ]

  const isActive = (href) => {
    return location.pathname === href
  }

  return (
    <div className="min-h-screen bg-[#f2e3ca]">
      {/* Sidebar para mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-[#ccb38c]">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#651b11]" />
              <span className="font-bold text-[#3e2a1b]">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <nav className="p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#651b11] text-[#f2e3ca]'
                      : 'text-[#785841] hover:bg-[#ccb38c] hover:text-[#3e2a1b]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-[#ccb38c]">
            <Shield className="w-6 h-6 text-[#651b11]" />
            <span className="font-bold text-[#3e2a1b]">Admin Panel</span>
          </div>

          {/* Perfil do usuário */}
          <div className="p-6 border-b border-[#ccb38c]">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-[#651b11] text-[#f2e3ca]">
                  {getInitials(user?.nome || 'A')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#3e2a1b] truncate">
                  {user?.nome}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-[#651b11]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                    Administrador
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu de navegação */}
          <nav className="flex-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#651b11] text-[#f2e3ca]'
                      : 'text-[#785841] hover:bg-[#ccb38c] hover:text-[#3e2a1b]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Botão de logout */}
          <div className="p-4 border-t border-[#ccb38c]">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-[#785841] hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="lg:pl-64">
        {/* Header mobile */}
        <div className="lg:hidden bg-white shadow-sm border-b border-[#ccb38c] p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#651b11]" />
              <span className="font-bold text-[#3e2a1b]">Admin Panel</span>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[#651b11] text-[#f2e3ca] text-xs">
                  {getInitials(user?.nome || 'A')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

