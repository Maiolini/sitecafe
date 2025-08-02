// Configuração da API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Em produção, usar URL relativa
  : 'http://localhost:5001/api'  // Em desenvolvimento, usar URL completa

// Classe para gerenciar requisições à API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('token')
  }

  // Configurar token de autenticação
  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  // Obter token atual
  getToken() {
    return this.token || localStorage.getItem('token')
  }

  // Fazer requisição HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Adicionar token de autenticação se disponível
    const token = this.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      
      // Se não autorizado, limpar token
      if (response.status === 401) {
        this.setToken(null)
        // Redirecionar para login se necessário
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Métodos HTTP convenientes
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // Métodos de autenticação
  async login(email, senha) {
    const response = await this.post('/auth/login', { email, senha })
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  async registerCliente(data) {
    const response = await this.post('/auth/register/cliente', data)
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  async registerFornecedor(data) {
    return this.post('/auth/register/fornecedor', data)
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email })
  }

  async resetPassword(token, nova_senha) {
    return this.post('/auth/reset-password', { token, nova_senha })
  }

  async getCurrentUser() {
    return this.get('/auth/me')
  }

  // Métodos do cliente
  async getClienteDashboard() {
    return this.get('/cliente/dashboard')
  }

  async getClientePedidos(page = 1, per_page = 10) {
    return this.get(`/cliente/pedidos?page=${page}&per_page=${per_page}`)
  }

  async criarPedido(data) {
    return this.post('/cliente/pedidos', data)
  }

  async getClientePerfil() {
    return this.get('/cliente/perfil')
  }

  async updateClientePerfil(data) {
    return this.put('/cliente/perfil', data)
  }

  async getClienteBeneficios() {
    return this.get('/cliente/beneficios')
  }

  // Métodos do admin
  async getAdminDashboard() {
    return this.get('/admin/dashboard')
  }

  async getAdminClientes(page = 1, per_page = 20, search = '') {
    return this.get(`/admin/clientes?page=${page}&per_page=${per_page}&search=${search}`)
  }

  async getAdminFornecedores(page = 1, per_page = 20, search = '', status = '') {
    return this.get(`/admin/fornecedores?page=${page}&per_page=${per_page}&search=${search}&status=${status}`)
  }

  async aprovarFornecedor(fornecedorId) {
    return this.post(`/admin/fornecedores/${fornecedorId}/aprovar`)
  }

  async toggleClienteStatus(clienteId) {
    return this.post(`/admin/clientes/${clienteId}/toggle-status`)
  }

  async toggleFornecedorStatus(fornecedorId) {
    return this.post(`/admin/fornecedores/${fornecedorId}/toggle-status`)
  }

  async getAdminPedidos(page = 1, per_page = 20, status = '') {
    return this.get(`/admin/pedidos?page=${page}&per_page=${per_page}&status=${status}`)
  }

  async updatePedidoStatus(pedidoId, status) {
    return this.put(`/admin/pedidos/${pedidoId}/status`, { status })
  }

  async getRelatorioVendas(data_inicio = '', data_fim = '') {
    return this.get(`/admin/relatorios/vendas?data_inicio=${data_inicio}&data_fim=${data_fim}`)
  }

  // Método para verificar saúde da API
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/api/health`)
      return await response.json()
    } catch (error) {
      console.error('Health check failed:', error)
      return { status: 'ERROR', message: 'API não disponível' }
    }
  }

  // Logout
  logout() {
    this.setToken(null)
    localStorage.removeItem('user')
    window.location.href = '/'
  }
}

// Instância global da API
const api = new ApiService()

export default api

