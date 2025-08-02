import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ArrowLeft, FileText, Users, ShoppingCart, CreditCard, AlertTriangle, Scale } from 'lucide-react'

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#f2e3ca]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-[#785841] hover:text-[#3e2a1b] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-[#651b11]" />
            <h1 className="text-3xl lg:text-4xl font-bold text-[#3e2a1b]">
              Termos de Uso
            </h1>
          </div>
          
          <p className="text-[#785841] text-lg">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 space-y-8">
          
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">1. Introdução e Aceitação</h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Bem-vindo ao Sistema de Parceiros da <strong>Café Maiolini</strong> ("nós", "nosso", "empresa" ou "Café Maiolini"). 
                Estes Termos de Uso ("Termos") regem o uso de nosso sistema de parceiros, website e serviços relacionados 
                (coletivamente, os "Serviços").
              </p>
              <p>
                Ao acessar ou usar nossos Serviços, você ("usuário", "você" ou "cliente") concorda em ficar vinculado 
                por estes Termos. Se você não concordar com qualquer parte destes Termos, não deve usar nossos Serviços.
              </p>
              <p>
                Estes Termos constituem um acordo legal entre você e a Café Maiolini. Recomendamos que leia 
                cuidadosamente todos os termos antes de utilizar nossos serviços.
              </p>
            </div>
          </section>

          {/* Definições */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">2. Definições</h2>
            <div className="text-[#785841] space-y-4">
              <p>Para os fins destes Termos, as seguintes definições se aplicam:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>"Sistema de Parceiros":</strong> Plataforma digital que conecta clientes, fornecedores e a Café Maiolini</li>
                <li><strong>"Cliente/Parceiro":</strong> Pessoa física ou jurídica que adquire café através do sistema</li>
                <li><strong>"Fornecedor":</strong> Empresa parceira que oferece produtos/serviços complementares aos clientes</li>
                <li><strong>"Cashback":</strong> Sistema de recompensas em dinheiro baseado nas compras realizadas</li>
                <li><strong>"Nível de Parceria":</strong> Classificação baseada no volume mensal de compras (Inicial, Avançado, Elite)</li>
                <li><strong>"Conta":</strong> Perfil de usuário criado no sistema para acesso aos serviços</li>
              </ul>
            </div>
          </section>

          {/* Elegibilidade e cadastro */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              3. Elegibilidade e Cadastro
            </h2>
            <div className="text-[#785841] space-y-4">
              <h3 className="text-xl font-semibold text-[#3e2a1b]">3.1 Requisitos de Elegibilidade</h3>
              <p>Para usar nossos Serviços, você deve:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ter pelo menos 18 anos de idade ou ser uma pessoa jurídica devidamente constituída</li>
                <li>Fornecer informações precisas, atuais e completas durante o processo de cadastro</li>
                <li>Manter suas informações de conta atualizadas</li>
                <li>Ser responsável por manter a confidencialidade de sua senha</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">3.2 Processo de Cadastro</h3>
              <p>
                O cadastro no sistema é gratuito para clientes. Fornecedores passam por um processo de 
                aprovação que pode levar até 5 dias úteis. Reservamo-nos o direito de recusar ou 
                cancelar cadastros a nosso critério.
              </p>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">3.3 Responsabilidade da Conta</h3>
              <p>
                Você é totalmente responsável por todas as atividades que ocorrem em sua conta. 
                Deve notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta 
                ou qualquer outra violação de segurança.
              </p>
            </div>
          </section>

          {/* Serviços oferecidos */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              4. Serviços Oferecidos
            </h2>
            <div className="text-[#785841] space-y-4">
              <h3 className="text-xl font-semibold text-[#3e2a1b]">4.1 Para Clientes</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Compra de Café:</strong> Acesso a café de qualidade com entregas regulares</li>
                <li><strong>Sistema de Cashback:</strong> Recompensas em dinheiro baseadas no volume de compras</li>
                <li><strong>Níveis de Parceria:</strong> Benefícios progressivos conforme o volume mensal</li>
                <li><strong>Acesso a Fornecedores:</strong> Descontos e benefícios exclusivos com parceiros</li>
                <li><strong>Entregas Automáticas:</strong> Opção de entregas programadas nos dias 15 e 30</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">4.2 Para Fornecedores</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acesso à Base de Clientes:</strong> Visibilidade para clientes qualificados</li>
                <li><strong>Plataforma de Marketing:</strong> Divulgação de produtos e serviços</li>
                <li><strong>Sistema de Benefícios:</strong> Ferramenta para oferecer descontos exclusivos</li>
                <li><strong>Relatórios:</strong> Dados sobre engajamento e conversões</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">4.3 Disponibilidade dos Serviços</h3>
              <p>
                Embora nos esforcemos para manter nossos Serviços disponíveis 24/7, não garantimos 
                disponibilidade ininterrupta. Podemos suspender temporariamente os Serviços para 
                manutenção, atualizações ou por outros motivos técnicos.
              </p>
            </div>
          </section>

          {/* Sistema de níveis e cashback */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              5. Sistema de Níveis e Cashback
            </h2>
            <div className="text-[#785841] space-y-4">
              <h3 className="text-xl font-semibold text-[#3e2a1b]">5.1 Níveis de Parceria</h3>
              <div className="bg-[#f2e3ca] p-4 rounded-lg">
                <ul className="space-y-2">
                  <li><strong>Parceiro Inicial:</strong> 5kg+ por mês - Cashback 1,5%, entrega emergencial, promoções sazonais</li>
                  <li><strong>Parceiro Avançado:</strong> 40kg+ por mês - Cashback 1,5%, brindes sazonais, kit de xícaras, descontos especiais</li>
                  <li><strong>Parceiro Elite:</strong> 80kg+ por mês - Cashback 2,0%, tour da torra, café personalizado, todos os benefícios anteriores</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">5.2 Regras do Cashback</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>O cashback é calculado sobre o valor líquido das compras (após descontos)</li>
                <li>O cashback é creditado automaticamente após a confirmação da entrega</li>
                <li>O cashback pode ser usado como desconto em futuras compras</li>
                <li>O cashback não pode ser convertido em dinheiro</li>
                <li>O cashback tem validade de 12 meses a partir da data de crédito</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">5.3 Cálculo dos Níveis</h3>
              <p>
                Os níveis são calculados mensalmente com base nas compras dos últimos 30 dias. 
                Mudanças de nível são aplicadas automaticamente no primeiro dia de cada mês.
              </p>
            </div>
          </section>

          {/* Pagamentos e preços */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">6. Pagamentos e Preços</h2>
            <div className="text-[#785841] space-y-4">
              <h3 className="text-xl font-semibold text-[#3e2a1b]">6.1 Preços</h3>
              <p>
                Os preços são apresentados em reais brasileiros (BRL) e incluem todos os impostos aplicáveis. 
                Reservamo-nos o direito de alterar preços a qualquer momento, mas alterações não afetarão 
                pedidos já confirmados.
              </p>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">6.2 Formas de Pagamento</h3>
              <p>Aceitamos as seguintes formas de pagamento:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cartões de crédito (Visa, Mastercard, American Express)</li>
                <li>Cartões de débito</li>
                <li>PIX</li>
                <li>Boleto bancário</li>
                <li>Cashback acumulado (como desconto)</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">6.3 Cobrança</h3>
              <p>
                O pagamento é processado no momento da confirmação do pedido. Para entregas automáticas, 
                a cobrança ocorre automaticamente na data programada.
              </p>
            </div>
          </section>

          {/* Entregas */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">7. Entregas</h2>
            <div className="text-[#785841] space-y-4">
              <h3 className="text-xl font-semibold text-[#3e2a1b]">7.1 Áreas de Entrega</h3>
              <p>
                Realizamos entregas na região da Baixada Santista e Grande São Paulo. 
                Consulte nossa área de cobertura no momento do pedido.
              </p>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">7.2 Prazos de Entrega</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Entregas Regulares:</strong> Dias 15 e 30 de cada mês</li>
                <li><strong>Entregas Emergenciais:</strong> Até 48h (disponível para Parceiros Iniciais+)</li>
                <li><strong>Primeira Entrega:</strong> Até 5 dias úteis após confirmação do pagamento</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">7.3 Responsabilidade na Entrega</h3>
              <p>
                Nossa responsabilidade pela entrega termina quando o produto é entregue no endereço 
                fornecido. É importante que alguém esteja presente para receber o pedido.
              </p>
            </div>
          </section>

          {/* Política de cancelamento */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">8. Cancelamentos e Reembolsos</h2>
            <div className="text-[#785841] space-y-4">
              <h3 className="text-xl font-semibold text-[#3e2a1b]">8.1 Cancelamento pelo Cliente</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pedidos podem ser cancelados até 24 horas antes da data de entrega programada</li>
                <li>Entregas automáticas podem ser pausadas ou canceladas a qualquer momento</li>
                <li>Cancelamentos após o prazo estão sujeitos a taxa de 20% sobre o valor do pedido</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">8.2 Reembolsos</h3>
              <p>
                Reembolsos são processados na forma original de pagamento em até 7 dias úteis. 
                Cashback usado como desconto não é reembolsável em dinheiro.
              </p>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">8.3 Problemas com Produtos</h3>
              <p>
                Se você receber um produto com defeito ou danificado, entre em contato conosco 
                em até 48 horas após a entrega para solução do problema.
              </p>
            </div>
          </section>

          {/* Responsabilidades e limitações */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              9. Responsabilidades e Limitações
            </h2>
            <div className="text-[#785841] space-y-4">
              <h3 className="text-xl font-semibold text-[#3e2a1b]">9.1 Uso Adequado</h3>
              <p>Você concorda em usar nossos Serviços apenas para fins legais e de acordo com estes Termos. É proibido:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Usar os Serviços para qualquer propósito ilegal ou não autorizado</li>
                <li>Interferir ou interromper os Serviços ou servidores conectados</li>
                <li>Tentar obter acesso não autorizado a qualquer parte dos Serviços</li>
                <li>Usar informações de outros usuários para fins não autorizados</li>
                <li>Criar múltiplas contas para fraudar o sistema de cashback</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">9.2 Limitação de Responsabilidade</h3>
              <p>
                Nossa responsabilidade é limitada ao valor pago pelos produtos ou serviços. 
                Não somos responsáveis por danos indiretos, especiais, incidentais ou consequenciais.
              </p>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">9.3 Fornecedores Terceiros</h3>
              <p>
                Não somos responsáveis por produtos, serviços ou benefícios oferecidos por 
                fornecedores parceiros. Questões relacionadas devem ser resolvidas diretamente 
                com o fornecedor.
              </p>
            </div>
          </section>

          {/* Propriedade intelectual */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">10. Propriedade Intelectual</h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Todos os direitos de propriedade intelectual relacionados aos Serviços, incluindo 
                mas não limitado a marcas, logos, design, conteúdo e software, são de propriedade 
                da Café Maiolini ou licenciados para nós.
              </p>
              <p>
                Você não pode copiar, modificar, distribuir, vender ou alugar qualquer parte dos 
                nossos Serviços sem nossa autorização expressa por escrito.
              </p>
            </div>
          </section>

          {/* Alterações nos termos */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">11. Alterações nos Termos</h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. 
                Alterações significativas serão comunicadas por email ou através de aviso 
                em nosso sistema com pelo menos 30 dias de antecedência.
              </p>
              <p>
                O uso continuado dos Serviços após as alterações constitui aceitação dos 
                novos Termos. Se você não concordar com as alterações, deve descontinuar 
                o uso dos Serviços.
              </p>
            </div>
          </section>

          {/* Rescisão */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">12. Rescisão</h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Você pode encerrar sua conta a qualquer momento através das configurações 
                da conta ou entrando em contato conosco. Podemos suspender ou encerrar sua 
                conta se você violar estes Termos.
              </p>
              <p>
                Após o encerramento da conta, você perderá acesso aos Serviços e qualquer 
                cashback não utilizado será perdido, exceto se exigido por lei.
              </p>
            </div>
          </section>

          {/* Lei aplicável */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6" />
              13. Lei Aplicável e Jurisdição
            </h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa será resolvida preferencialmente através de mediação ou arbitragem.
              </p>
              <p>
                Caso seja necessário recurso judicial, fica eleito o foro da comarca de Santos/SP 
                para dirimir qualquer controvérsia decorrente destes Termos.
              </p>
            </div>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">14. Contato</h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              
              <div className="bg-[#f2e3ca] p-4 rounded-lg">
                <h3 className="font-semibold text-[#3e2a1b] mb-2">Café Maiolini</h3>
                <div className="space-y-1">
                  <p>Email: contato@cafemaiolini.com</p>
                  <p>Telefone: (13) 3333-4444</p>
                  <p>WhatsApp: (13) 99999-9999</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TermsOfService

