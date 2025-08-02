import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import jwt
from datetime import timedelta
import logging

class EmailService:
    def __init__(self):
        # Configurações de e-mail (simulação para desenvolvimento)
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.email_user = os.environ.get('EMAIL_USER', 'cafemaiolini@gmail.com')
        self.email_password = os.environ.get('EMAIL_PASSWORD', '')
        self.from_name = 'Café Maiolini'
        
    def send_email(self, to_email, subject, html_content, text_content=None):
        """Simula envio de e-mail para desenvolvimento"""
        try:
            # Para desenvolvimento, apenas logamos o e-mail
            print(f"=== E-MAIL ENVIADO ===")
            print(f"Para: {to_email}")
            print(f"Assunto: {subject}")
            print(f"Conteúdo: {html_content}")
            print(f"=====================")
            
            # Log para arquivo também
            logging.info(f"E-mail enviado para {to_email}: {subject}")
            
            return True
        except Exception as e:
            print(f"Erro ao enviar e-mail: {str(e)}")
            return False

    def send_welcome_email(self, user_email, user_name, user_type):
        """Envia e-mail de boas-vindas"""
        subject = f"Bem-vindo ao Café Maiolini, {user_name}!"
        
        if user_type == 'cliente':
            html_content = f"""
            <h2>Bem-vindo ao Café Maiolini!</h2>
            <p>Olá {user_name},</p>
            <p>Sua conta de cliente foi criada com sucesso!</p>
            <p>Agora você pode aproveitar nosso sistema de cashback e benefícios exclusivos.</p>
            <p>Acesse seu dashboard para começar a fazer pedidos.</p>
            <br>
            <p>Atenciosamente,<br>Equipe Café Maiolini</p>
            """
        else:
            html_content = f"""
            <h2>Solicitação de Parceria Recebida!</h2>
            <p>Olá {user_name},</p>
            <p>Recebemos sua solicitação para se tornar um fornecedor parceiro.</p>
            <p>Nossa equipe irá analisar sua proposta e entrar em contato em breve.</p>
            <br>
            <p>Atenciosamente,<br>Equipe Café Maiolini</p>
            """
        
        return self.send_email(user_email, subject, html_content)

    def send_password_reset_email(self, user_email, reset_token):
        """Envia e-mail de recuperação de senha"""
        subject = "Recuperação de Senha - Café Maiolini"
        
        reset_link = f"https://19hninc1opev.manus.space/reset-password?token={reset_token}"
        
        html_content = f"""
        <h2>Recuperação de Senha</h2>
        <p>Você solicitou a recuperação de sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <p><a href="{reset_link}">Redefinir Senha</a></p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou esta recuperação, ignore este e-mail.</p>
        <br>
        <p>Atenciosamente,<br>Equipe Café Maiolini</p>
        """
        
        return self.send_email(user_email, subject, html_content)

