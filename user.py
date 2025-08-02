from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=True)
    tipo_usuario = db.Column(db.String(20), nullable=False, default='cliente')  # cliente, fornecedor, admin
    ativo = db.Column(db.Boolean, default=True)
    aprovado = db.Column(db.Boolean, default=True)  # Para fornecedores que precisam de aprovação
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Campos para reset de senha
    reset_token = db.Column(db.String(255), nullable=True)
    reset_token_expiration = db.Column(db.DateTime, nullable=True)
    
    # Relacionamentos
    cliente = db.relationship('Cliente', backref='user', uselist=False, cascade='all, delete-orphan')
    fornecedor = db.relationship('Fornecedor', backref='user', uselist=False, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_token(self):
        payload = {
            'user_id': self.id,
            'tipo_usuario': self.tipo_usuario,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        return jwt.encode(payload, os.environ.get('SECRET_KEY', 'default-secret'), algorithm='HS256')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'nome': self.nome,
            'telefone': self.telefone,
            'tipo_usuario': self.tipo_usuario,
            'ativo': self.ativo,
            'aprovado': self.aprovado,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    empresa = db.Column(db.String(100), nullable=True)
    cnpj = db.Column(db.String(18), nullable=True)
    endereco = db.Column(db.Text, nullable=True)
    cidade = db.Column(db.String(50), nullable=True)
    estado = db.Column(db.String(2), nullable=True)
    cep = db.Column(db.String(10), nullable=True)
    nivel_parceria = db.Column(db.String(20), default='inicial')  # inicial, avancado, elite
    cashback_acumulado = db.Column(db.Float, default=0.0)
    total_compras_mes = db.Column(db.Float, default=0.0)
    data_ultima_compra = db.Column(db.DateTime, nullable=True)
    
    # Relacionamentos
    pedidos = db.relationship('Pedido', backref='cliente', cascade='all, delete-orphan')
    transacoes_cashback = db.relationship('TransacaoCashback', backref='cliente', cascade='all, delete-orphan')

    def calcular_nivel_parceria(self):
        """Calcula o nível de parceria baseado no volume mensal"""
        if self.total_compras_mes >= 80:
            return 'elite'
        elif self.total_compras_mes >= 40:
            return 'avancado'
        elif self.total_compras_mes >= 5:
            return 'inicial'
        else:
            return 'inicial'

    def get_taxa_cashback(self):
        """Retorna a taxa de cashback baseada no nível"""
        if self.nivel_parceria == 'elite':
            return 0.02  # 2%
        else:
            return 0.015  # 1.5%

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'empresa': self.empresa,
            'cnpj': self.cnpj,
            'endereco': self.endereco,
            'cidade': self.cidade,
            'estado': self.estado,
            'cep': self.cep,
            'nivel_parceria': self.nivel_parceria,
            'cashback_acumulado': self.cashback_acumulado,
            'total_compras_mes': self.total_compras_mes,
            'data_ultima_compra': self.data_ultima_compra.isoformat() if self.data_ultima_compra else None
        }

class Fornecedor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    nome_empresa = db.Column(db.String(100), nullable=False)
    cnpj = db.Column(db.String(18), nullable=True)
    categoria = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    endereco = db.Column(db.Text, nullable=True)
    cidade = db.Column(db.String(50), nullable=True)
    estado = db.Column(db.String(2), nullable=True)
    cep = db.Column(db.String(10), nullable=True)
    instagram = db.Column(db.String(100), nullable=True)
    site = db.Column(db.String(200), nullable=True)
    
    # Relacionamentos
    beneficios = db.relationship('BeneficioFornecedor', backref='fornecedor', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nome_empresa': self.nome_empresa,
            'cnpj': self.cnpj,
            'categoria': self.categoria,
            'descricao': self.descricao,
            'endereco': self.endereco,
            'cidade': self.cidade,
            'estado': self.estado,
            'cep': self.cep,
            'instagram': self.instagram,
            'site': self.site,
            'beneficios': [b.to_dict() for b in self.beneficios]
        }

class BeneficioFornecedor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fornecedor_id = db.Column(db.Integer, db.ForeignKey('fornecedor.id'), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    nivel_minimo = db.Column(db.String(20), default='inicial')  # inicial, avancado, elite
    ativo = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'fornecedor_id': self.fornecedor_id,
            'descricao': self.descricao,
            'nivel_minimo': self.nivel_minimo,
            'ativo': self.ativo
        }

class Pedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    quantidade_kg = db.Column(db.Float, nullable=False)
    tipo_cafe = db.Column(db.String(50), nullable=False)  # moido, graos
    tipo_torra = db.Column(db.String(50), nullable=False)  # media, escura
    valor_total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pendente')  # pendente, processando, entregue, cancelado
    data_pedido = db.Column(db.DateTime, default=datetime.utcnow)
    data_entrega = db.Column(db.DateTime, nullable=True)
    endereco_entrega = db.Column(db.Text, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    automatico = db.Column(db.Boolean, default=False)  # Se é um pedido automático
    dia_entrega_automatica = db.Column(db.Integer, nullable=True)  # 15 ou 30

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'quantidade_kg': self.quantidade_kg,
            'tipo_cafe': self.tipo_cafe,
            'tipo_torra': self.tipo_torra,
            'valor_total': self.valor_total,
            'status': self.status,
            'data_pedido': self.data_pedido.isoformat() if self.data_pedido else None,
            'data_entrega': self.data_entrega.isoformat() if self.data_entrega else None,
            'endereco_entrega': self.endereco_entrega,
            'observacoes': self.observacoes,
            'automatico': self.automatico,
            'dia_entrega_automatica': self.dia_entrega_automatica
        }

class TransacaoCashback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedido.id'), nullable=True)
    tipo = db.Column(db.String(20), nullable=False)  # ganho, uso
    valor = db.Column(db.Float, nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data_transacao = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'pedido_id': self.pedido_id,
            'tipo': self.tipo,
            'valor': self.valor,
            'descricao': self.descricao,
            'data_transacao': self.data_transacao.isoformat() if self.data_transacao else None
        }

class ConfiguracaoSistema(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chave = db.Column(db.String(50), unique=True, nullable=False)
    valor = db.Column(db.Text, nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'chave': self.chave,
            'valor': self.valor,
            'descricao': self.descricao,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

