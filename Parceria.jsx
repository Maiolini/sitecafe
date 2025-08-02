import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Coffee, 
  TrendingUp, 
  Gift, 
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  MapPin,
  Award
} from 'lucide-react'

const Parceria = () => {
  const partnershipLevels = [
    {
      name: "Parceiro Inicial",
      requirement: "5kg+ por mês",
      cashback: "1.5%",
      icon: <Coffee className="h-8 w-8" />,
      color: "level-badge-inicial",
      benefits: [
        "1.5% de cashback em todas as compras",
        "Entrega emergencial de café",
        "Participação em ações promocionais sazonais",
        "Acesso aos benefícios dos fornecedores parceiros",
        "Suporte prioritário via WhatsApp"
      ],
      description: "Ideal para pequenos estabelecimentos que estão começando no programa de parceria."
    },
    {
      name: "Parceiro Avançado", 
      requirement: "40kg+ por mês",
      cashback: "1.5%",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "level-badge-avancado",
      benefits: [
        "Todos os benefícios do nível Inicial",
        "Brindes sazonais exclusivos",
        "Kit de xícaras personalizadas",
        "Acesso a descontos especiais",
        "Consultoria gratuita para otimização do negócio",
        "Prioridade em novos produtos"
      ],
      description: "Para estabelecimentos em crescimento que querem maximizar seus benefícios."
    },
    {
      name: "Parceiro Elite",
      requirement: "80kg+ por mês", 
      cashback: "2.0%",
      icon: <Star className="h-8 w-8" />,
      color: "level-badge-elite",
      benefits: [
        "Todos os benefícios dos níveis anteriores",
        "2.0% de cashback (maior taxa disponível)",
        "Tour da torra em Minas Gerais com tudo pago",
        "Café personalizado com rótulo exclusivo (opcional)",
        "Acesso VIP a eventos e degustações",
        "Gerente de conta dedicado",
        "Condições especiais de pagamento"
      ],
      description: "O nível mais exclusivo, para grandes parceiros que valorizam experiências únicas."
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Cadastre-se",
      description: "Crie sua conta gratuita no sistema Café Maiolini",
      icon: <Users className="h-6 w-6" />
    },
    {
      step: "2", 
      title: "Faça Pedidos",
      description: "Compre café através do nosso sistema ou informe compras externas",
      icon: <Coffee className="h-6 w-6" />
    },
    {
      step: "3",
      title: "Acumule Volume",
      description: "Seu nível é calculado automaticamente baseado no volume mensal",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      step: "4",
      title: "Aproveite Benefícios",
      description: "Acesse cashback, descontos e benefícios exclusivos",
      icon: <Gift className="h-6 w-6" />
    }
  ]

  const faq = [
    {
      question: "Como é calculado meu nível de parceria?",
      answer: "Seu nível é baseado na quantidade total de café comprada por mês. O sistema calcula automaticamente e atualiza seu nível conforme suas compras."
    },
    {
      question: "Posso usar o cashback imediatamente?",
      answer: "Sim! O cashback acumulado pode ser usado como desconto em suas próximas compras de café."
    },
    {
      question: "E se eu comprar café por WhatsApp ou telefone?",
      answer: "Sem problemas! Nossa equipe adiciona manualmente essas compras ao seu histórico para garantir que você não perca nenhum benefício."
    },
    {
      question: "Como funcionam as entregas programadas?",
      answer: "Você pode configurar entregas automáticas que acontecem nos dias 15 e 30 de cada mês, garantindo que nunca fique sem café."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="coffee-hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 coffee-bean-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 hero-text-shadow">
              Sistema de
              <span className="text-coffee-cream block">Parceria</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-coffee-light hero-text-shadow">
              Evolua seus benefícios conforme aumenta seu volume de compras. 
              Quanto mais você compra, mais vantagens exclusivas você recebe.
            </p>
            <Link to="/cadastro">
              <Button size="lg" className="bg-coffee-cream text-coffee-dark hover:bg-white text-lg px-8 py-3">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Em apenas 4 passos simples, você já estará aproveitando todos 
              os benefícios do nosso sistema de parceria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-coffee-red-dark text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <div className="mb-4 flex justify-center text-coffee-red">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-coffee-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-coffee-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Níveis de Parceria */}
      <section className="py-20 coffee-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Níveis de Parceria
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Cada nível oferece benefícios únicos e exclusivos. Evolua conforme 
              seu volume de compras e desbloqueie vantagens incríveis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {partnershipLevels.map((level, index) => (
              <Card key={index} className="coffee-card relative overflow-hidden h-full">
                <div className={`absolute top-0 left-0 right-0 h-2 ${level.color}`}></div>
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-4 rounded-full ${level.color} w-fit`}>
                    {level.icon}
                  </div>
                  <Badge className={`${level.color} mb-2 mx-auto text-base px-4 py-1`}>
                    {level.name}
                  </Badge>
                  <CardTitle className="text-coffee-dark text-lg">{level.requirement}</CardTitle>
                  <div className="text-4xl font-bold text-coffee-red-dark">
                    {level.cashback}
                  </div>
                  <CardDescription className="text-coffee-medium">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {level.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-coffee-medium">
                        <CheckCircle className="h-5 w-5 text-coffee-red mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios Especiais */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Benefícios Especiais
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Além do cashback e dos níveis, oferecemos benefícios únicos 
              que fazem a diferença no seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="coffee-card text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-coffee-red mx-auto mb-4" />
                <CardTitle className="text-coffee-dark">Entregas Programadas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-coffee-medium">
                  Configure entregas automáticas nos dias 15 e 30. Nunca mais fique sem café!
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="coffee-card text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-coffee-red mx-auto mb-4" />
                <CardTitle className="text-coffee-dark">Tour em Minas Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-coffee-medium">
                  Parceiros Elite ganham uma viagem completa para conhecer nossa torra em MG.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="coffee-card text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-coffee-red mx-auto mb-4" />
                <CardTitle className="text-coffee-dark">Café Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-coffee-medium">
                  Crie seu próprio blend com rótulo exclusivo da sua empresa.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="coffee-card text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-coffee-red mx-auto mb-4" />
                <CardTitle className="text-coffee-dark">Rede de Fornecedores</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-coffee-medium">
                  Acesso exclusivo a descontos de fornecedores parceiros da região.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 coffee-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Tire suas dúvidas sobre o sistema de parceria.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faq.map((item, index) => (
              <Card key={index} className="coffee-card">
                <CardHeader>
                  <CardTitle className="text-coffee-dark text-lg">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-coffee-medium">
                    {item.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 coffee-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 coffee-bean-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 hero-text-shadow">
              Pronto para Começar sua Jornada?
            </h2>
            <p className="text-xl mb-8 text-coffee-light hero-text-shadow">
              Cadastre-se agora e comece a acumular benefícios desde a primeira compra. 
              É gratuito e você já entra no nível Inicial automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="bg-coffee-cream text-coffee-dark hover:bg-white text-lg px-8 py-3">
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/fornecedores">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-coffee-cream text-coffee-cream hover:bg-coffee-cream hover:text-coffee-dark">
                  Ver Fornecedores Parceiros
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Parceria

