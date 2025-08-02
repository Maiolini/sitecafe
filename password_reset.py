from flask import Blueprint, request, jsonify
from src.models.user import User, db
import secrets
import string
from datetime import datetime, timedelta
import hashlib

password_reset_bp = Blueprint('password_reset', __name__)

def generate_reset_token():
    """Gera um token seguro para reset de senha"""
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(32))
    return token

def hash_token(token):
    """Hash do token para armazenamento seguro"""
    return hashlib.sha256(token.encode()).hexdigest()

@password_reset_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Solicita reset de senha"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'message': 'Email é obrigatório'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            # Por segurança, sempre retorna sucesso mesmo se o email não existir
            return jsonify({
                'message': 'Se o email existir em nossa base, você receberá instruções para redefinir sua senha.'
            }), 200
        
        # Gera token de reset
        reset_token = generate_reset_token()
        token_hash = hash_token(reset_token)
        
        # Define expiração para 1 hora
        expiration = datetime.utcnow() + timedelta(hours=1)
        
        # Salva o token no usuário
        user.reset_token = token_hash
        user.reset_token_expiration = expiration
        db.session.commit()
        
        # Em um ambiente real, aqui enviaria o email
        # Por enquanto, vamos simular o envio
        print(f"Token de reset para {email}: {reset_token}")
        print(f"Link de reset: http://localhost:5174/reset-password?token={reset_token}")
        
        return jsonify({
            'message': 'Se o email existir em nossa base, você receberá instruções para redefinir sua senha.',
            'debug_token': reset_token  # Apenas para desenvolvimento
        }), 200
        
    except Exception as e:
        print(f"Erro ao processar solicitação de reset: {e}")
        return jsonify({'message': 'Erro interno do servidor'}), 500

@password_reset_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset da senha usando token"""
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('password')
        
        if not token or not new_password:
            return jsonify({'message': 'Token e nova senha são obrigatórios'}), 400
        
        if len(new_password) < 6:
            return jsonify({'message': 'A senha deve ter pelo menos 6 caracteres'}), 400
        
        # Hash do token recebido
        token_hash = hash_token(token)
        
        # Busca usuário com o token
        user = User.query.filter_by(reset_token=token_hash).first()
        
        if not user:
            return jsonify({'message': 'Token inválido ou expirado'}), 400
        
        # Verifica se o token não expirou
        if user.reset_token_expiration < datetime.utcnow():
            # Remove token expirado
            user.reset_token = None
            user.reset_token_expiration = None
            db.session.commit()
            return jsonify({'message': 'Token expirado'}), 400
        
        # Atualiza a senha
        user.set_password(new_password)
        
        # Remove o token usado
        user.reset_token = None
        user.reset_token_expiration = None
        
        db.session.commit()
        
        return jsonify({'message': 'Senha alterada com sucesso'}), 200
        
    except Exception as e:
        print(f"Erro ao resetar senha: {e}")
        return jsonify({'message': 'Erro interno do servidor'}), 500

@password_reset_bp.route('/validate-reset-token', methods=['POST'])
def validate_reset_token():
    """Valida se um token de reset é válido"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'message': 'Token é obrigatório'}), 400
        
        # Hash do token recebido
        token_hash = hash_token(token)
        
        # Busca usuário com o token
        user = User.query.filter_by(reset_token=token_hash).first()
        
        if not user:
            return jsonify({'valid': False, 'message': 'Token inválido'}), 200
        
        # Verifica se o token não expirou
        if user.reset_token_expiration < datetime.utcnow():
            # Remove token expirado
            user.reset_token = None
            user.reset_token_expiration = None
            db.session.commit()
            return jsonify({'valid': False, 'message': 'Token expirado'}), 200
        
        return jsonify({
            'valid': True, 
            'message': 'Token válido',
            'email': user.email
        }), 200
        
    except Exception as e:
        print(f"Erro ao validar token: {e}")
        return jsonify({'valid': False, 'message': 'Erro interno do servidor'}), 500

