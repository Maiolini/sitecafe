from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from src.models.user import db, User, Cliente, Fornecedor
import jwt
import os
from functools import wraps
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token é obrigatório'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, os.environ.get('SECRET_KEY', 'default-secret'), algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'message': 'Token inválido'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.tipo_usuario != 'admin':
            return jsonify({'message': 'Acesso negado. Apenas administradores.'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validação básica
        required_fields = ['email', 'password', 'nome', 'tipo_usuario']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se email já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email já cadastrado'}), 400
        
        # Criar usuário
        user = User(
            email=data['email'],
            nome=data['nome'],
            telefone=data.get('telefone'),
            tipo_usuario=data['tipo_usuario']
        )
        user.set_password(data['password'])
        
        # Para fornecedores, definir como não aprovado por padrão
        if data['tipo_usuario'] == 'fornecedor':
            user.aprovado = False
        
        db.session.add(user)
        db.session.flush()  # Para obter o ID do usuário
        
        # Criar perfil específico baseado no tipo
        if data['tipo_usuario'] == 'cliente':
            cliente = Cliente(
                user_id=user.id,
                empresa=data.get('empresa'),
                cnpj=data.get('cnpj'),
                endereco=data.get('endereco'),
                cidade=data.get('cidade'),
                estado=data.get('estado'),
                cep=data.get('cep')
            )
            db.session.add(cliente)
            
        elif data['tipo_usuario'] == 'fornecedor':
            fornecedor = Fornecedor(
                user_id=user.id,
                nome_empresa=data.get('nome_empresa', ''),
                cnpj=data.get('cnpj'),
                categoria=data.get('categoria', ''),
                descricao=data.get('descricao'),
                endereco=data.get('endereco'),
                cidade=data.get('cidade'),
                estado=data.get('estado'),
                cep=data.get('cep'),
                instagram=data.get('instagram'),
                site=data.get('site')
            )
            db.session.add(fornecedor)
        
        db.session.commit()
        
        # Gerar token apenas se aprovado ou se for cliente
        if user.aprovado:
            token = user.generate_token()
            return jsonify({
                'message': 'Usuário criado com sucesso',
                'token': token,
                'user': user.to_dict()
            }), 201
        else:
            return jsonify({
                'message': 'Cadastro realizado com sucesso. Aguarde aprovação do administrador.',
                'user': user.to_dict()
            }), 201
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email e senha são obrigatórios'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Credenciais inválidas'}), 401
        
        if not user.ativo:
            return jsonify({'message': 'Conta desativada'}), 401
        
        if not user.aprovado:
            return jsonify({'message': 'Conta aguardando aprovação'}), 401
        
        token = user.generate_token()
        
        # Incluir dados específicos do perfil
        user_data = user.to_dict()
        if user.tipo_usuario == 'cliente' and user.cliente:
            user_data['cliente'] = user.cliente.to_dict()
        elif user.tipo_usuario == 'fornecedor' and user.fornecedor:
            user_data['fornecedor'] = user.fornecedor.to_dict()
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'token': token,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    try:
        user_data = current_user.to_dict()
        
        if current_user.tipo_usuario == 'cliente' and current_user.cliente:
            user_data['cliente'] = current_user.cliente.to_dict()
        elif current_user.tipo_usuario == 'fornecedor' and current_user.fornecedor:
            user_data['fornecedor'] = current_user.fornecedor.to_dict()
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        data = request.get_json()
        
        # Atualizar dados básicos do usuário
        if 'nome' in data:
            current_user.nome = data['nome']
        if 'telefone' in data:
            current_user.telefone = data['telefone']
        
        # Atualizar dados específicos do perfil
        if current_user.tipo_usuario == 'cliente' and current_user.cliente:
            cliente = current_user.cliente
            for field in ['empresa', 'cnpj', 'endereco', 'cidade', 'estado', 'cep']:
                if field in data:
                    setattr(cliente, field, data[field])
                    
        elif current_user.tipo_usuario == 'fornecedor' and current_user.fornecedor:
            fornecedor = current_user.fornecedor
            for field in ['nome_empresa', 'cnpj', 'categoria', 'descricao', 'endereco', 'cidade', 'estado', 'cep', 'instagram', 'site']:
                if field in data:
                    setattr(fornecedor, field, data[field])
        
        db.session.commit()
        
        return jsonify({'message': 'Perfil atualizado com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/change-password', methods=['PUT'])
@token_required
def change_password(current_user):
    try:
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'message': 'Senha atual e nova senha são obrigatórias'}), 400
        
        if not current_user.check_password(data['current_password']):
            return jsonify({'message': 'Senha atual incorreta'}), 400
        
        current_user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({'message': 'Senha alterada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

