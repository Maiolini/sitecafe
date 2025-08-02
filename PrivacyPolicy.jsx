import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Mail, Phone } from 'lucide-react'

const PrivacyPolicy = () => {
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
            <Shield className="w-8 h-8 text-[#651b11]" />
            <h1 className="text-3xl lg:text-4xl font-bold text-[#3e2a1b]">
              Política de Privacidade
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
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              1. Introdução
            </h2>
            <div className="text-[#785841] space-y-4">
              <p>
                A <strong>Café Maiolini</strong> ("nós", "nosso" ou "empresa") está comprometida em proteger 
                e respeitar sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, 
                armazenamos e protegemos suas informações pessoais quando você utiliza nosso sistema de 
                parceiros e serviços relacionados.
              </p>
              <p>
                Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
                e outras legislações aplicáveis de proteção de dados.
              </p>
              <p>
                Ao utilizar nossos serviços, você concorda com a coleta e uso de informações de acordo 
                com esta política. Se você não concordar com qualquer parte desta política, 
                recomendamos que não utilize nossos serviços.
              </p>
            </div>
          </section>

          {/* Informações que coletamos */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <Database className="w-6 h-6" />
              2. Informações que Coletamos
            </h2>
            <div className="text-[#785841] space-y-4">
              <h3 className="text-xl font-semibold text-[#3e2a1b]">2.1 Informações Pessoais</h3>
              <p>Coletamos as seguintes informações pessoais quando você se cadastra em nosso sistema:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dados de Identificação:</strong> Nome completo, email, telefone</li>
                <li><strong>Dados Empresariais:</strong> Nome da empresa, CNPJ (para fornecedores)</li>
                <li><strong>Dados de Localização:</strong> Endereço, cidade, estado, CEP</li>
                <li><strong>Dados de Acesso:</strong> Senha criptografada, histórico de login</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">2.2 Informações de Uso</h3>
              <p>Automaticamente coletamos informações sobre como você usa nossos serviços:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dados de Navegação:</strong> Páginas visitadas, tempo de permanência, cliques</li>
                <li><strong>Informações Técnicas:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
                <li><strong>Dados de Transação:</strong> Histórico de pedidos, valores, cashback acumulado</li>
                <li><strong>Preferências:</strong> Configurações de conta, preferências de comunicação</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">2.3 Cookies e Tecnologias Similares</h3>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
                personalizar conteúdo e analisar o uso de nossos serviços. Você pode controlar 
                o uso de cookies através das configurações do seu navegador.
              </p>
            </div>
          </section>

          {/* Como usamos suas informações */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6" />
              3. Como Usamos Suas Informações
            </h2>
            <div className="text-[#785841] space-y-4">
              <p>Utilizamos suas informações pessoais para os seguintes propósitos:</p>
              
              <h3 className="text-xl font-semibold text-[#3e2a1b]">3.1 Prestação de Serviços</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Processar e gerenciar seu cadastro no sistema de parceiros</li>
                <li>Processar pedidos de café e coordenar entregas</li>
                <li>Calcular e gerenciar seu cashback e nível de parceria</li>
                <li>Facilitar o acesso aos benefícios dos fornecedores parceiros</li>
                <li>Fornecer suporte ao cliente e resolver problemas</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">3.2 Comunicação</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Enviar confirmações de pedidos e atualizações de status</li>
                <li>Comunicar mudanças em seu nível de parceria</li>
                <li>Informar sobre novos benefícios e promoções</li>
                <li>Enviar comunicações administrativas importantes</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">3.3 Melhorias e Análises</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Analisar padrões de uso para melhorar nossos serviços</li>
                <li>Desenvolver novos recursos e funcionalidades</li>
                <li>Realizar pesquisas de satisfação e feedback</li>
                <li>Gerar relatórios estatísticos (dados anonimizados)</li>
              </ul>
            </div>
          </section>

          {/* Compartilhamento de informações */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              4. Compartilhamento de Informações
            </h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Não vendemos, alugamos ou comercializamos suas informações pessoais para terceiros. 
                Compartilhamos suas informações apenas nas seguintes situações:
              </p>

              <h3 className="text-xl font-semibold text-[#3e2a1b]">4.1 Fornecedores Parceiros</h3>
              <p>
                Compartilhamos informações limitadas (nome, empresa, telefone) com nossos fornecedores 
                parceiros aprovados para que possam oferecer benefícios exclusivos aos nossos clientes. 
                Este compartilhamento é baseado no seu consentimento ao se cadastrar no sistema de parceiros.
              </p>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">4.2 Prestadores de Serviços</h3>
              <p>
                Podemos compartilhar informações com prestadores de serviços terceirizados que nos 
                ajudam a operar nossos serviços, como:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Serviços de hospedagem e infraestrutura</li>
                <li>Processamento de pagamentos</li>
                <li>Serviços de entrega</li>
                <li>Análise de dados e marketing</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3e2a1b] mt-6">4.3 Obrigações Legais</h3>
              <p>
                Podemos divulgar suas informações quando exigido por lei, ordem judicial ou 
                para proteger nossos direitos, propriedade ou segurança.
              </p>
            </div>
          </section>

          {/* Segurança */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              5. Segurança das Informações
            </h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para 
                proteger suas informações pessoais contra acesso não autorizado, alteração, 
                divulgação ou destruição:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Criptografia:</strong> Senhas são criptografadas usando algoritmos seguros</li>
                <li><strong>Acesso Restrito:</strong> Apenas funcionários autorizados têm acesso aos dados</li>
                <li><strong>Monitoramento:</strong> Sistemas de monitoramento para detectar atividades suspeitas</li>
                <li><strong>Backups Seguros:</strong> Backups regulares em ambientes protegidos</li>
                <li><strong>Atualizações:</strong> Sistemas sempre atualizados com patches de segurança</li>
              </ul>
              <p>
                Embora implementemos medidas de segurança robustas, nenhum sistema é 100% seguro. 
                Recomendamos que você mantenha suas credenciais de acesso seguras e nos notifique 
                imediatamente sobre qualquer atividade suspeita em sua conta.
              </p>
            </div>
          </section>

          {/* Seus direitos */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">6. Seus Direitos (LGPD)</h2>
            <div className="text-[#785841] space-y-4">
              <p>
                De acordo com a LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acesso:</strong> Solicitar informações sobre quais dados pessoais processamos</li>
                <li><strong>Correção:</strong> Solicitar a correção de dados incompletos ou incorretos</li>
                <li><strong>Exclusão:</strong> Solicitar a exclusão de dados desnecessários ou tratados incorretamente</li>
                <li><strong>Portabilidade:</strong> Solicitar a transferência de seus dados para outro fornecedor</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento de seus dados em certas circunstâncias</li>
                <li><strong>Revogação:</strong> Revogar seu consentimento a qualquer momento</li>
              </ul>
              <p>
                Para exercer qualquer um desses direitos, entre em contato conosco através dos 
                canais indicados na seção "Contato" desta política.
              </p>
            </div>
          </section>

          {/* Retenção de dados */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">7. Retenção de Dados</h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir 
                os propósitos descritos nesta política, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dados de Conta:</strong> Enquanto sua conta estiver ativa</li>
                <li><strong>Dados de Transação:</strong> Por 5 anos após a última transação (requisito fiscal)</li>
                <li><strong>Dados de Marketing:</strong> Até você revogar o consentimento</li>
                <li><strong>Dados de Suporte:</strong> Por 2 anos após o último contato</li>
              </ul>
              <p>
                Após os períodos de retenção, os dados são excluídos de forma segura ou anonimizados 
                para fins estatísticos.
              </p>
            </div>
          </section>

          {/* Alterações */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4">8. Alterações nesta Política</h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente para refletir 
                mudanças em nossas práticas ou por outros motivos operacionais, legais ou regulamentares.
              </p>
              <p>
                Quando fizermos alterações significativas, notificaremos você por email ou 
                através de um aviso em nosso site. A data da última atualização será sempre 
                indicada no topo desta política.
              </p>
              <p>
                Recomendamos que você revise esta política periodicamente para se manter 
                informado sobre como protegemos suas informações.
              </p>
            </div>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-2xl font-bold text-[#3e2a1b] mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              9. Contato
            </h2>
            <div className="text-[#785841] space-y-4">
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer 
                seus direitos de proteção de dados, entre em contato conosco:
              </p>
              
              <div className="bg-[#f2e3ca] p-4 rounded-lg">
                <h3 className="font-semibold text-[#3e2a1b] mb-2">Café Maiolini</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#651b11]" />
                    <span>Email: privacidade@cafemaiolini.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#651b11]" />
                    <span>Telefone: (13) 3333-4444</span>
                  </div>
                </div>
              </div>
              
              <p>
                <strong>Encarregado de Proteção de Dados (DPO):</strong><br />
                Para questões específicas sobre proteção de dados, você pode entrar em contato 
                diretamente com nosso Encarregado de Proteção de Dados através do email: 
                dpo@cafemaiolini.com
              </p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy

