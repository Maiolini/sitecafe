import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Phone, Instagram, Globe, Coffee, Users, Gift } from 'lucide-react'

const Fornecedores = () => {
  const fornecedores = [
    {
      id: 1,
      nome: "Velozes dos Ovos",
      descricao: "Fornecedor de ovos em geral, vários tamanhos e tipos",
      beneficios: ["3% de desconto em qualquer compra", "Frete grátis"],
      contatos: {
        telefone: "13996804852",
        instagram: "@velozes013"
      },
      categoria: "Ovos"
    },
    {
      id: 2,
      nome: "Denise Salgados",
      descricao: "Fornecedor de salgados em geral",
      beneficios: ["10% de desconto nas 3 primeiras compras"],
      contatos: {
        telefone: "1321384736",
        instagram: "@denise.salgados",
        site: "https://denisesalgados.com.br"
      },
      categoria: "Salgados"
    },
    {
      id: 3,
      nome: "Pães Artesanais Emiborah",
      descricao: "Fornecedor de pães artesanais",
      beneficios: [
        "A partir de 30un de ciabatta, cada unidade vai sair a R$4,50",
        "Revendedor tem 30% de desconto acima de 10un de qualquer produto"
      ],
      contatos: {
        telefone: "(13) 98159-9375",
        instagram: "@emiborah.paes"
      },
      categoria: "Pães Artesanais"
    }
  ]

  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const categories = ["Todos", ...new Set(fornecedores.map(f => f.categoria))]

  const filteredFornecedores = selectedCategory === "Todos" 
    ? fornecedores 
    : fornecedores.filter(f => f.categoria === selectedCategory)

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  return (
    <div className="min-h-screen coffee-gradient">
      {/* Header */}
      <section className="bg-white/90 backdrop-blur-md border-b border-coffee-brown/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Coffee className="h-12 w-12 text-coffee-red-dark" />
              <h1 className="text-4xl md:text-5xl font-bold text-coffee-dark">
                Fornecedores Parceiros
              </h1>
            </div>
            <p className="text-xl text-coffee-medium mb-8">
              Descubra os benefícios exclusivos que nossos fornecedores parceiros 
              oferecem para clientes do Café Maiolini. Quanto maior seu nível de 
              parceria, mais vantagens você tem acesso.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="benefit-tag">Descontos Exclusivos</Badge>
              <Badge className="benefit-tag">Frete Grátis</Badge>
              <Badge className="benefit-tag">Produtos Especiais</Badge>
              <Badge className="benefit-tag">Atendimento Prioritário</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category 
                  ? "btn-primary" 
                  : "border-coffee-brown text-coffee-dark hover:bg-coffee-light"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="coffee-card text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-coffee-red-dark mx-auto mb-2" />
              <div className="text-2xl font-bold text-coffee-dark">{fornecedores.length}</div>
              <p className="text-coffee-medium">Fornecedores Parceiros</p>
            </CardContent>
          </Card>
          <Card className="coffee-card text-center">
            <CardContent className="pt-6">
              <Gift className="h-8 w-8 text-coffee-red-dark mx-auto mb-2" />
              <div className="text-2xl font-bold text-coffee-dark">
                {fornecedores.reduce((acc, f) => acc + f.beneficios.length, 0)}
              </div>
              <p className="text-coffee-medium">Benefícios Disponíveis</p>
            </CardContent>
          </Card>
          <Card className="coffee-card text-center">
            <CardContent className="pt-6">
              <Coffee className="h-8 w-8 text-coffee-red-dark mx-auto mb-2" />
              <div className="text-2xl font-bold text-coffee-dark">100%</div>
              <p className="text-coffee-medium">Exclusivo para Clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFornecedores.map(fornecedor => (
            <Card key={fornecedor.id} className="coffee-card h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-coffee-dark text-xl">
                    {fornecedor.nome}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-coffee-light text-coffee-dark">
                    {fornecedor.categoria}
                  </Badge>
                </div>
                <CardDescription className="text-coffee-medium">
                  {fornecedor.descricao}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Benefícios */}
                <div>
                  <h4 className="font-semibold text-coffee-dark mb-2 flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    Benefícios Exclusivos:
                  </h4>
                  <div className="space-y-2">
                    {fornecedor.beneficios.map((beneficio, index) => (
                      <div key={index} className="benefit-tag text-sm">
                        {beneficio}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contatos */}
                <div>
                  <h4 className="font-semibold text-coffee-dark mb-3">Contatos:</h4>
                  <div className="space-y-2">
                    {fornecedor.contatos.telefone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start btn-secondary border-coffee-brown"
                        onClick={() => window.open(`tel:${fornecedor.contatos.telefone}`, '_blank')}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {formatPhone(fornecedor.contatos.telefone)}
                      </Button>
                    )}
                    
                    {fornecedor.contatos.instagram && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start btn-secondary border-coffee-brown"
                        onClick={() => window.open(`https://instagram.com/${fornecedor.contatos.instagram.replace('@', '')}`, '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        {fornecedor.contatos.instagram}
                      </Button>
                    )}
                    
                    {fornecedor.contatos.site && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start btn-secondary border-coffee-brown"
                        onClick={() => window.open(fornecedor.contatos.site, '_blank')}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visitar Site
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-20">
          <Card className="coffee-card">
            <CardContent className="pt-8 text-center">
              <Coffee className="h-16 w-16 text-coffee-red-dark mx-auto mb-6 float-animation" />
              <h3 className="text-2xl font-bold text-coffee-dark mb-4">
                Quer Acessar Esses Benefícios?
              </h3>
              <p className="text-coffee-medium max-w-2xl mx-auto mb-6">
                Cadastre-se no sistema Café Maiolini e comece a aproveitar 
                descontos exclusivos e benefícios especiais de todos os nossos 
                fornecedores parceiros.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-primary">
                  Criar Conta Gratuita
                </Button>
                <Button size="lg" variant="outline" className="border-coffee-brown text-coffee-dark hover:bg-coffee-light">
                  Saiba Mais Sobre Parceria
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Info */}
        <footer className="mt-16 text-center">
          <Card className="coffee-card">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-coffee-dark mb-2">
                Ecossistema de Parceiros
              </h3>
              <p className="text-coffee-medium max-w-2xl mx-auto">
                Conectamos nossos clientes de café com os melhores fornecedores da região, 
                criando um ecossistema de benefícios mútuos e oportunidades de negócio.
              </p>
            </CardContent>
          </Card>
        </footer>
      </main>
    </div>
  )
}

export default Fornecedores

