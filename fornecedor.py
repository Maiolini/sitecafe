from flask import Blueprint, request, jsonify
from src.models.user import db, User, Cliente, Fornecedor, BeneficioFornecedor
from src.routes.auth import token_required
from sqlalchemy import or_

fornecedor_bp = Blueprint('fornecedor', __name__)

@fornecedor_bp.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    try:
        if current_user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Acesso negado'}), 403
        
        fornecedor = current_user.fornecedor
        if not fornecedor:
            return jsonify({'message': 'Perfil de fornecedor não encontrado'}), 404
        
        # Total de clientes que podem acessar os benefícios
        total_clientes = Cliente.query.join(User).filter(
            User.ativo == True,
            User.aprovado == True
        ).count()
        
        # Clientes por nível
        clientes_inicial = Cliente.query.join(User).filter(
            User.ativo == True,
            User.aprovado == True,
            Cliente.nivel_parceria == 'inicial'
        ).count()
        
        clientes_avancado = Cliente.query.join(User).filter(
            User.ativo == True,
            User.aprovado == True,
            Cliente.nivel_parceria == 'avancado'
        ).count()
        
        clientes_elite = Cliente.query.join(User).filter(
            User.ativo == True,
            User.aprovado == True,
            Cliente.nivel_parceria == 'elite'
        ).count()
        
        # Benefícios ativos do fornecedor
        beneficios_ativos = BeneficioFornecedor.query.filter(
            BeneficioFornecedor.fornecedor_id == fornecedor.id,
            BeneficioFornecedor.ativo == True
        ).count()
        
        return jsonify({
            'fornecedor': fornecedor.to_dict(),
            'estatisticas': {
                'total_clientes': total_clientes,
                'clientes_inicial': clientes_inicial,
                'clientes_avancado': clientes_avancado,
                'clientes_elite': clientes_elite,
                'beneficios_ativos': beneficios_ativos
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@fornecedor_bp.route('/clientes', methods=['GET'])
@token_required
def get_clientes(current_user):
    try:
        if current_user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Acesso negado'}), 403
        
        # Parâmetros de filtro e paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        nivel = request.args.get('nivel')
        busca = request.args.get('busca')
        cidade = request.args.get('cidade')
        
        query = db.session.query(Cliente, User).join(
            User, Cliente.user_id == User.id
        ).filter(
            User.ativo == True,
            User.aprovado == True
        )
        
        if nivel:
            query = query.filter(Cliente.nivel_parceria == nivel)
        
        if cidade:
            query = query.filter(Cliente.cidade.ilike(f'%{cidade}%'))
        
        if busca:
            query = query.filter(
                or_(
                    User.nome.ilike(f'%{busca}%'),
                    Cliente.empresa.ilike(f'%{busca}%'),
                    User.email.ilike(f'%{busca}%')
                )
            )
        
        clientes = query.order_by(User.nome).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        resultado = []
        for cliente, user in clientes.items:
            # Não expor informações sensíveis
            resultado.append({
                'id': cliente.id,
                'nome': user.nome,
                'empresa': cliente.empresa,
                'cidade': cliente.cidade,
                'estado': cliente.estado,
                'nivel_parceria': cliente.nivel_parceria,
                'telefone': user.telefone,  # Para contato comercial
                'data_ultima_compra': cliente.data_ultima_compra.isoformat() if cliente.data_ultima_compra else None
            })
        
        return jsonify({
            'clientes': resultado,
            'total': clientes.total,
            'pages': clientes.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@fornecedor_bp.route('/beneficios', methods=['GET'])
@token_required
def get_beneficios(current_user):
    try:
        if current_user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Acesso negado'}), 403
        
        fornecedor = current_user.fornecedor
        if not fornecedor:
            return jsonify({'message': 'Perfil de fornecedor não encontrado'}), 404
        
        beneficios = BeneficioFornecedor.query.filter(
            BeneficioFornecedor.fornecedor_id == fornecedor.id
        ).order_by(BeneficioFornecedor.id.desc()).all()
        
        return jsonify({
            'beneficios': [b.to_dict() for b in beneficios]
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@fornecedor_bp.route('/beneficios', methods=['POST'])
@token_required
def criar_beneficio(current_user):
    try:
        if current_user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Acesso negado'}), 403
        
        fornecedor = current_user.fornecedor
        if not fornecedor:
            return jsonify({'message': 'Perfil de fornecedor não encontrado'}), 404
        
        data = request.get_json()
        
        if not data.get('descricao'):
            return jsonify({'message': 'Descrição do benefício é obrigatória'}), 400
        
        nivel_minimo = data.get('nivel_minimo', 'inicial')
        if nivel_minimo not in ['inicial', 'avancado', 'elite']:
            return jsonify({'message': 'Nível mínimo inválido'}), 400
        
        beneficio = BeneficioFornecedor(
            fornecedor_id=fornecedor.id,
            descricao=data['descricao'],
            nivel_minimo=nivel_minimo,
            ativo=data.get('ativo', True)
        )
        
        db.session.add(beneficio)
        db.session.commit()
        
        return jsonify({
            'message': 'Benefício criado com sucesso',
            'beneficio': beneficio.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@fornecedor_bp.route('/beneficios/<int:beneficio_id>', methods=['PUT'])
@token_required
def atualizar_beneficio(current_user, beneficio_id):
    try:
        if current_user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Acesso negado'}), 403
        
        fornecedor = current_user.fornecedor
        if not fornecedor:
            return jsonify({'message': 'Perfil de fornecedor não encontrado'}), 404
        
        beneficio = BeneficioFornecedor.query.filter(
            BeneficioFornecedor.id == beneficio_id,
            BeneficioFornecedor.fornecedor_id == fornecedor.id
        ).first()
        
        if not beneficio:
            return jsonify({'message': 'Benefício não encontrado'}), 404
        
        data = request.get_json()
        
        if 'descricao' in data:
            beneficio.descricao = data['descricao']
        
        if 'nivel_minimo' in data:
            if data['nivel_minimo'] not in ['inicial', 'avancado', 'elite']:
                return jsonify({'message': 'Nível mínimo inválido'}), 400
            beneficio.nivel_minimo = data['nivel_minimo']
        
        if 'ativo' in data:
            beneficio.ativo = data['ativo']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Benefício atualizado com sucesso',
            'beneficio': beneficio.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@fornecedor_bp.route('/beneficios/<int:beneficio_id>', methods=['DELETE'])
@token_required
def deletar_beneficio(current_user, beneficio_id):
    try:
        if current_user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Acesso negado'}), 403
        
        fornecedor = current_user.fornecedor
        if not fornecedor:
            return jsonify({'message': 'Perfil de fornecedor não encontrado'}), 404
        
        beneficio = BeneficioFornecedor.query.filter(
            BeneficioFornecedor.id == beneficio_id,
            BeneficioFornecedor.fornecedor_id == fornecedor.id
        ).first()
        
        if not beneficio:
            return jsonify({'message': 'Benefício não encontrado'}), 404
        
        db.session.delete(beneficio)
        db.session.commit()
        
        return jsonify({'message': 'Benefício removido com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@fornecedor_bp.route('/estatisticas-clientes', methods=['GET'])
@token_required
def get_estatisticas_clientes(current_user):
    try:
        if current_user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Acesso negado'}), 403
        
        # Distribuição por cidade
        clientes_por_cidade = db.session.query(
            Cliente.cidade,
            db.func.count(Cliente.id).label('count')
        ).join(
            User, Cliente.user_id == User.id
        ).filter(
            User.ativo == True,
            User.aprovado == True,
            Cliente.cidade.isnot(None)
        ).group_by(Cliente.cidade).order_by(db.func.count(Cliente.id).desc()).limit(10).all()
        
        # Distribuição por nível
        clientes_por_nivel = db.session.query(
            Cliente.nivel_parceria,
            db.func.count(Cliente.id).label('count')
        ).join(
            User, Cliente.user_id == User.id
        ).filter(
            User.ativo == True,
            User.aprovado == True
        ).group_by(Cliente.nivel_parceria).all()
        
        # Clientes mais ativos (por data da última compra)
        from datetime import datetime, timedelta
        data_limite = datetime.now() - timedelta(days=30)
        
        clientes_ativos = db.session.query(
            User.nome,
            Cliente.empresa,
            Cliente.cidade,
            Cliente.nivel_parceria,
            Cliente.data_ultima_compra
        ).join(
            User, Cliente.user_id == User.id
        ).filter(
            User.ativo == True,
            User.aprovado == True,
            Cliente.data_ultima_compra >= data_limite
        ).order_by(Cliente.data_ultima_compra.desc()).limit(20).all()
        
        return jsonify({
            'clientes_por_cidade': [
                {'cidade': cidade, 'count': count}
                for cidade, count in clientes_por_cidade
            ],
            'clientes_por_nivel': [
                {'nivel': nivel, 'count': count}
                for nivel, count in clientes_por_nivel
            ],
            'clientes_ativos_recentes': [
                {
                    'nome': nome,
                    'empresa': empresa,
                    'cidade': cidade,
                    'nivel_parceria': nivel,
                    'data_ultima_compra': data_ultima_compra.isoformat() if data_ultima_compra else None
                }
                for nome, empresa, cidade, nivel, data_ultima_compra in clientes_ativos
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

