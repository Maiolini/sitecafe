import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  Coffee, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  Heart,
  Users,
  Award
} from 'lucide-react'

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aqui seria implementada a lógica de envio do formulário
    console.log('Formulário enviado:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    })
  }

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefone",
      info: "(13) 99999-9999",
      description: "Segunda a Sexta, 8h às 18h"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "E-mail",
      info: "contato@cafemaiolini.com",
      description: "Respondemos em até 24h"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Localização",
      info: "Santos, SP",
      description: "Atendemos toda a região"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      info: "(13) 99999-9999",
      description: "Atendimento rápido e direto"
    }
  ]

  const timeline = [
    {
      year: "2020",
      title: "O Início",
      description: "Fundação do Café Maiolini com o sonho de conectar produtores e consumidores de café de qualidade."
    },
    {
      year: "2021",
      title: "Primeiros Parceiros",
      description: "Estabelecemos parcerias com fornecedores locais, criando nossa primeira rede de benefícios mútuos."
    },
    {
      year: "2022",
      title: "Expansão Regional",
      description: "Crescemos para atender toda a região de Santos, aumentando nossa carteira de clientes e fornecedores."
    },
    {
      year: "2023",
      title: "Sistema de Níveis",
      description: "Lançamos o sistema de parceria com níveis, oferecendo benefícios progressivos aos nossos clientes."
    },
    {
      year: "2024",
      title: "Plataforma Digital",
      description: "Desenvolvemos nossa plataforma online para facilitar pedidos e gerenciamento de benefícios."
    },
    {
      year: "2025",
      title: "Ecossistema Completo",
      description: "Hoje somos um ecossistema completo que conecta café, clientes e fornecedores em uma rede de benefícios únicos."
    }
  ]

  const values = [
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "Qualidade",
      description: "Oferecemos apenas café de alta qualidade, selecionado cuidadosamente para nossos parceiros."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Parceria",
      description: "Acreditamos em relacionamentos duradouros e benefícios mútuos para todos os envolvidos."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Paixão",
      description: "Nossa paixão pelo café e pelo atendimento excepcional move tudo o que fazemos."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excelência",
      description: "Buscamos constantemente a excelência em produtos, serviços e relacionamentos."
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
              Nossa
              <span className="text-coffee-cream block">História</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-coffee-light hero-text-shadow">
              Conheça a jornada do Café Maiolini e como nos tornamos o ecossistema 
              de parceiros que conecta café, clientes e fornecedores.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Nossa Jornada
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Desde 2020, construímos um ecossistema único que vai muito além do café. 
              Veja como chegamos até aqui.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-coffee-red-dark text-white rounded-full flex items-center justify-center text-lg font-bold">
                      {item.year}
                    </div>
                  </div>
                  <Card className="coffee-card flex-1">
                    <CardHeader>
                      <CardTitle className="text-coffee-dark">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-coffee-medium">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-20 coffee-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Os princípios que guiam nossa empresa e definem como trabalhamos 
              com nossos clientes e parceiros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="coffee-card text-center h-full">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-coffee-red-dark/10 text-coffee-red-dark w-fit">
                    {value.icon}
                  </div>
                  <CardTitle className="text-coffee-dark">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-coffee-medium">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-coffee-dark mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Estamos aqui para ajudar! Entre em contato conosco através de 
              qualquer um dos canais abaixo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((contact, index) => (
                  <Card key={index} className="coffee-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-coffee-red-dark/10 text-coffee-red-dark">
                          {contact.icon}
                        </div>
                        <CardTitle className="text-coffee-dark text-lg">
                          {contact.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-coffee-dark mb-1">
                        {contact.info}
                      </p>
                      <CardDescription className="text-coffee-medium">
                        {contact.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Horário de Funcionamento */}
              <Card className="coffee-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-coffee-red-dark" />
                    <CardTitle className="text-coffee-dark">Horário de Funcionamento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-coffee-medium">
                    <div className="flex justify-between">
                      <span>Segunda a Sexta:</span>
                      <span className="font-semibold">8h às 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado:</span>
                      <span className="font-semibold">8h às 14h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo:</span>
                      <span className="font-semibold">Fechado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Redes Sociais */}
              <Card className="coffee-card">
                <CardHeader>
                  <CardTitle className="text-coffee-dark">Siga-nos nas Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="border-coffee-brown">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm" className="border-coffee-brown">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Contato */}
            <Card className="coffee-card">
              <CardHeader>
                <CardTitle className="text-coffee-dark">Envie uma Mensagem</CardTitle>
                <CardDescription className="text-coffee-medium">
                  Preencha o formulário abaixo e entraremos em contato em breve.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        className="border-coffee-brown/30 focus:border-coffee-red"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className="border-coffee-brown/30 focus:border-coffee-red"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-coffee-brown/30 focus:border-coffee-red"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="assunto">Assunto *</Label>
                    <Input
                      id="assunto"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleInputChange}
                      required
                      className="border-coffee-brown/30 focus:border-coffee-red"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="border-coffee-brown/30 focus:border-coffee-red"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full btn-primary">
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contato

