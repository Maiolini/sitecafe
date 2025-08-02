import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Coffee, 
  Users, 
  Gift, 
  TrendingUp, 
  Shield, 
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  User
} from 'lucide-react'

const Home = () => {
  const benefits = [
    {
      icon: <Gift className="h-8 w-8 text-coffee-red" />,
      title: "Cashback Exclusivo",
      description: "Ganhe de 1.5% a 2% de cashback em todas as suas compras de café"
    },
    {
      icon: <Users className="h-8 w-8 text-coffee-red" />,
      title: "Rede de Fornecedores",
      description: "Acesso exclusivo a descontos e benefícios de fornecedores parceiros"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-coffee-red" />,
      title: "Níveis de Parceria",
      description: "Evolua seus benefícios conforme aumenta seu volume de compras"
    },
    {
      icon: <Clock className="h-8 w-8 text-coffee-red" />,
      title: "Entregas Programadas",
      description: "Automatize seus pedidos com entregas nos dias 15 e 30"
    }
  ]

  const partnershipLevels = [
    {
      name: "Parceiro Inicial",
      requirement: "5kg+ por mês",
      cashback: "1.5%",
      benefits: ["Entrega emergencial", "Ações promocionais"],
      color: "level-badge-inicial"
    },
    {
      name: "Parceiro Avançado", 
      requirement: "40kg+ por mês",
      cashback: "1.5%",
      benefits: ["Brindes sazonais", "Kit de xícaras", "Descontos especiais"],
      color: "level-badge-avancado"
    },
    {
      name: "Parceiro Elite",
      requirement: "80kg+ por mês", 
      cashback: "2.0%",
      benefits: ["Tour em MG", "Café personalizado", "Todos os benefícios anteriores"],
      color: "level-badge-elite"
    }
  ]

  const stats = [
    { number: "500+", label: "Clientes Ativos" },
    { number: "15+", label: "Fornecedores Parceiros" },
    { number: "98%", label: "Satisfação" },
    { number: "24h", label: "Suporte" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="coffee-hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 coffee-bean-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 hero-text-shadow">
              Seu Ecossistema de
              <span className="text-coffee-cream block">Café e Parceiros</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-coffee-light hero-text-shadow">
              Conecte-se aos melhores fornecedores da região, acumule cashback 
              e evolua seus benefícios através do nosso sistema de parceria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="btn-primary text-lg px-8 py-3">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/parceria">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-coffee-cream text-coffee-cream hover:bg-coffee-cream hover:text-coffee-dark">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-coffee-red-dark mb-2">
                  {stat.number}
                </div>
                <div className="text-coffee-medium font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 coffee-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Por que Escolher o Café Maiolini?
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Mais do que café, oferecemos um ecossistema completo de benefícios 
              e oportunidades para o seu negócio crescer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="coffee-card text-center h-full">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-coffee-light/20">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-coffee-dark">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-coffee-medium">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Levels Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Níveis de Parceria
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Evolua seus benefícios conforme aumenta seu volume de compras mensais. 
              Quanto mais você compra, mais vantagens você recebe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnershipLevels.map((level, index) => (
              <Card key={index} className="coffee-card relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${level.color}`}></div>
                <CardHeader className="text-center">
                  <Badge className={`${level.color} mb-2 mx-auto`}>
                    {level.name}
                  </Badge>
                  <CardTitle className="text-coffee-dark">{level.requirement}</CardTitle>
                  <div className="text-3xl font-bold text-coffee-red-dark">
                    {level.cashback}
                  </div>
                  <CardDescription>Cashback</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {level.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-coffee-medium">
                        <CheckCircle className="h-4 w-4 text-coffee-red mr-2 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/parceria">
              <Button size="lg" className="btn-primary">
                Ver Todos os Benefícios
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 coffee-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 coffee-bean-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 hero-text-shadow">
              Pronto para Fazer Parte do Nosso Ecossistema?
            </h2>
            <p className="text-xl mb-8 text-coffee-light hero-text-shadow">
              Cadastre-se agora e comece a aproveitar todos os benefícios 
              do sistema de parceria Café Maiolini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="bg-coffee-cream text-coffee-dark hover:bg-white text-lg px-8 py-3">
                  <User className="mr-2 h-5 w-5" />
                  Criar Conta Gratuita
                </Button>
              </Link>
              <Link to="/fornecedores">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-coffee-cream text-coffee-cream hover:bg-coffee-cream hover:text-coffee-dark">
                  Ver Fornecedores
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

