from flask import Blueprint, request, jsonify
from src.models.user import db, User, Cliente, Fornecedor, Pedido, TransacaoCashback, BeneficioFornecedor, ConfiguracaoSistema
from src.routes.auth import token_required, admin_required
from datetime import datetime, timedelta
from sqlalchemy import func, extract, or_

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@token_required
@admin_required
def get_admin_dashboard(current_user):
    try:
        # Estatísticas gerais
        total_clientes = Cliente.query.count()
        total_fornecedores = Fornecedor.query.count()
        
        # Fornecedores pendentes de aprovação
        fornecedores_pendentes = User.query.filter(
            User.tipo_usuario == 'fornecedor',
            User.aprovado == False
        ).count()
        
        # Pedidos do mês atual
        mes_atual = datetime.now().month
        ano_atual = datetime.now().year
        
        pedidos_mes = Pedido.query.filter(
            extract('month', Pedido.data_pedido) == mes_atual,
            extract('year', Pedido.data_pedido) == ano_atual
        ).count()
        
        # Faturamento do mês
        faturamento_mes = db.session.query(func.sum(Pedido.valor_total)).filter(
            extract('month', Pedido.data_pedido) == mes_atual,
            extract('year', Pedido.data_pedido) == ano_atual
        ).scalar() or 0
        
        # Volume de café do mês
        volume_mes = db.session.query(func.sum(Pedido.quantidade_kg)).filter(
            extract('month', Pedido.data_pedido) == mes_atual,
            extract('year', Pedido.data_pedido) == ano_atual
        ).scalar() or 0
        
        # Cashback total acumulado
        cashback_total = db.session.query(func.sum(Cliente.cashback_acumulado)).scalar() or 0
        
        # Últimos pedidos
        ultimos_pedidos = db.session.query(Pedido, Cliente, User).join(
            Cliente, Pedido.cliente_id == Cliente.id
        ).join(
            User, Cliente.user_id == User.id
        ).order_by(Pedido.data_pedido.desc()).limit(10).all()
        
        # Distribuição por nível de parceria
        niveis = db.session.query(
            Cliente.nivel_parceria,
            func.count(Cliente.id).label('count')
        ).group_by(Cliente.nivel_parceria).all()
        
        return jsonify({
            'estatisticas': {
                'total_clientes': total_clientes,
                'total_fornecedores': total_fornecedores,
                'fornecedores_pendentes': fornecedores_pendentes,
                'pedidos_mes': pedidos_mes,
                'faturamento_mes': float(faturamento_mes),
                'volume_mes': float(volume_mes),
                'cashback_total': float(cashback_total)
            },
            'ultimos_pedidos': [
                {
                    'pedido': pedido.to_dict(),
                    'cliente': {
                        'nome': user.nome,
                        'email': user.email,
                        'empresa': cliente.empresa
                    }
                }
                for pedido, cliente, user in ultimos_pedidos
            ],
            'distribuicao_niveis': [
                {'nivel': nivel, 'count': count}
                for nivel, count in niveis
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/usuarios', methods=['GET'])
@token_required
@admin_required
def get_usuarios(current_user):
    try:
        # Parâmetros de filtro e paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        tipo_usuario = request.args.get('tipo_usuario')
        status = request.args.get('status')  # ativo, inativo, pendente
        busca = request.args.get('busca')
        
        query = User.query
        
        if tipo_usuario:
            query = query.filter(User.tipo_usuario == tipo_usuario)
        
        if status == 'ativo':
            query = query.filter(User.ativo == True, User.aprovado == True)
        elif status == 'inativo':
            query = query.filter(User.ativo == False)
        elif status == 'pendente':
            query = query.filter(User.aprovado == False)
        
        if busca:
            query = query.filter(
                or_(
                    User.nome.ilike(f'%{busca}%'),
                    User.email.ilike(f'%{busca}%')
                )
            )
        
        usuarios = query.order_by(User.data_criacao.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        resultado = []
        for user in usuarios.items:
            user_data = user.to_dict()
            if user.tipo_usuario == 'cliente' and user.cliente:
                user_data['cliente'] = user.cliente.to_dict()
            elif user.tipo_usuario == 'fornecedor' and user.fornecedor:
                user_data['fornecedor'] = user.fornecedor.to_dict()
            resultado.append(user_data)
        
        return jsonify({
            'usuarios': resultado,
            'total': usuarios.total,
            'pages': usuarios.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/aprovar-fornecedor/<int:user_id>', methods=['PUT'])
@token_required
@admin_required
def aprovar_fornecedor(current_user, user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        
        if user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Usuário não é um fornecedor'}), 400
        
        user.aprovado = True
        db.session.commit()
        
        return jsonify({'message': 'Fornecedor aprovado com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/rejeitar-fornecedor/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def rejeitar_fornecedor(current_user, user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        
        if user.tipo_usuario != 'fornecedor':
            return jsonify({'message': 'Usuário não é um fornecedor'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'Fornecedor rejeitado e removido'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/toggle-usuario/<int:user_id>', methods=['PUT'])
@token_required
@admin_required
def toggle_usuario(current_user, user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        
        if user.id == current_user.id:
            return jsonify({'message': 'Não é possível desativar sua própria conta'}), 400
        
        user.ativo = not user.ativo
        db.session.commit()
        
        status = 'ativado' if user.ativo else 'desativado'
        return jsonify({'message': f'Usuário {status} com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/pedidos', methods=['GET'])
@token_required
@admin_required
def get_pedidos(current_user):
    try:
        # Parâmetros de filtro e paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        cliente_id = request.args.get('cliente_id', type=int)
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = db.session.query(Pedido, Cliente, User).join(
            Cliente, Pedido.cliente_id == Cliente.id
        ).join(
            User, Cliente.user_id == User.id
        )
        
        if status:
            query = query.filter(Pedido.status == status)
        
        if cliente_id:
            query = query.filter(Pedido.cliente_id == cliente_id)
        
        if data_inicio:
            data_inicio_dt = datetime.strptime(data_inicio, '%Y-%m-%d')
            query = query.filter(Pedido.data_pedido >= data_inicio_dt)
        
        if data_fim:
            data_fim_dt = datetime.strptime(data_fim, '%Y-%m-%d')
            query = query.filter(Pedido.data_pedido <= data_fim_dt)
        
        pedidos = query.order_by(Pedido.data_pedido.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        resultado = []
        for pedido, cliente, user in pedidos.items:
            resultado.append({
                'pedido': pedido.to_dict(),
                'cliente': {
                    'id': cliente.id,
                    'nome': user.nome,
                    'email': user.email,
                    'empresa': cliente.empresa,
                    'nivel_parceria': cliente.nivel_parceria
                }
            })
        
        return jsonify({
            'pedidos': resultado,
            'total': pedidos.total,
            'pages': pedidos.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/atualizar-status-pedido/<int:pedido_id>', methods=['PUT'])
@token_required
@admin_required
def atualizar_status_pedido(current_user, pedido_id):
    try:
        pedido = Pedido.query.get(pedido_id)
        if not pedido:
            return jsonify({'message': 'Pedido não encontrado'}), 404
        
        data = request.get_json()
        novo_status = data.get('status')
        
        if novo_status not in ['pendente', 'processando', 'entregue', 'cancelado']:
            return jsonify({'message': 'Status inválido'}), 400
        
        pedido.status = novo_status
        
        if novo_status == 'entregue' and not pedido.data_entrega:
            pedido.data_entrega = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Status do pedido atualizado com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/adicionar-compra-manual', methods=['POST'])
@token_required
@admin_required
def adicionar_compra_manual(current_user):
    try:
        data = request.get_json()
        
        # Validação
        required_fields = ['cliente_id', 'quantidade_kg', 'valor_total', 'tipo_cafe', 'tipo_torra']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Campo {field} é obrigatório'}), 400
        
        cliente = Cliente.query.get(data['cliente_id'])
        if not cliente:
            return jsonify({'message': 'Cliente não encontrado'}), 404
        
        # Criar pedido manual
        pedido = Pedido(
            cliente_id=cliente.id,
            quantidade_kg=data['quantidade_kg'],
            tipo_cafe=data['tipo_cafe'],
            tipo_torra=data['tipo_torra'],
            valor_total=data['valor_total'],
            status='entregue',  # Compra já realizada
            data_pedido=datetime.strptime(data.get('data_pedido', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d'),
            data_entrega=datetime.strptime(data.get('data_entrega', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d'),
            observacoes=data.get('observacoes', 'Compra adicionada manualmente pelo administrador')
        )
        
        db.session.add(pedido)
        db.session.flush()
        
        # Calcular e adicionar cashback
        taxa_cashback = cliente.get_taxa_cashback()
        valor_cashback = data['valor_total'] * taxa_cashback
        
        transacao_cashback = TransacaoCashback(
            cliente_id=cliente.id,
            pedido_id=pedido.id,
            tipo='ganho',
            valor=valor_cashback,
            descricao=f'Cashback da compra manual #{pedido.id}'
        )
        
        cliente.cashback_acumulado += valor_cashback
        cliente.data_ultima_compra = pedido.data_pedido
        
        # Recalcular nível de parceria
        mes_pedido = pedido.data_pedido.month
        ano_pedido = pedido.data_pedido.year
        
        total_mes = db.session.query(func.sum(Pedido.quantidade_kg)).filter(
            Pedido.cliente_id == cliente.id,
            extract('month', Pedido.data_pedido) == mes_pedido,
            extract('year', Pedido.data_pedido) == ano_pedido
        ).scalar() or 0
        
        cliente.total_compras_mes = total_mes
        cliente.nivel_parceria = cliente.calcular_nivel_parceria()
        
        db.session.add(transacao_cashback)
        db.session.commit()
        
        return jsonify({
            'message': 'Compra manual adicionada com sucesso',
            'pedido': pedido.to_dict(),
            'cashback_ganho': valor_cashback,
            'novo_nivel': cliente.nivel_parceria
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/relatorio-vendas', methods=['GET'])
@token_required
@admin_required
def relatorio_vendas(current_user):
    try:
        # Parâmetros de período
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        if not data_inicio or not data_fim:
            return jsonify({'message': 'Data de início e fim são obrigatórias'}), 400
        
        data_inicio_dt = datetime.strptime(data_inicio, '%Y-%m-%d')
        data_fim_dt = datetime.strptime(data_fim, '%Y-%m-%d')
        
        # Vendas no período
        vendas = Pedido.query.filter(
            Pedido.data_pedido >= data_inicio_dt,
            Pedido.data_pedido <= data_fim_dt,
            Pedido.status.in_(['entregue', 'processando'])
        ).all()
        
        # Estatísticas
        total_vendas = len(vendas)
        faturamento_total = sum(v.valor_total for v in vendas)
        volume_total = sum(v.quantidade_kg for v in vendas)
        ticket_medio = faturamento_total / total_vendas if total_vendas > 0 else 0
        
        # Vendas por mês
        vendas_por_mes = db.session.query(
            extract('year', Pedido.data_pedido).label('ano'),
            extract('month', Pedido.data_pedido).label('mes'),
            func.count(Pedido.id).label('quantidade'),
            func.sum(Pedido.valor_total).label('faturamento'),
            func.sum(Pedido.quantidade_kg).label('volume')
        ).filter(
            Pedido.data_pedido >= data_inicio_dt,
            Pedido.data_pedido <= data_fim_dt,
            Pedido.status.in_(['entregue', 'processando'])
        ).group_by(
            extract('year', Pedido.data_pedido),
            extract('month', Pedido.data_pedido)
        ).all()
        
        # Top clientes
        top_clientes = db.session.query(
            Cliente.id,
            User.nome,
            Cliente.empresa,
            func.count(Pedido.id).label('total_pedidos'),
            func.sum(Pedido.valor_total).label('total_gasto'),
            func.sum(Pedido.quantidade_kg).label('total_kg')
        ).join(
            User, Cliente.user_id == User.id
        ).join(
            Pedido, Cliente.id == Pedido.cliente_id
        ).filter(
            Pedido.data_pedido >= data_inicio_dt,
            Pedido.data_pedido <= data_fim_dt,
            Pedido.status.in_(['entregue', 'processando'])
        ).group_by(
            Cliente.id, User.nome, Cliente.empresa
        ).order_by(
            func.sum(Pedido.valor_total).desc()
        ).limit(10).all()
        
        return jsonify({
            'periodo': {
                'data_inicio': data_inicio,
                'data_fim': data_fim
            },
            'resumo': {
                'total_vendas': total_vendas,
                'faturamento_total': float(faturamento_total),
                'volume_total': float(volume_total),
                'ticket_medio': float(ticket_medio)
            },
            'vendas_por_mes': [
                {
                    'ano': int(ano),
                    'mes': int(mes),
                    'quantidade': quantidade,
                    'faturamento': float(faturamento),
                    'volume': float(volume)
                }
                for ano, mes, quantidade, faturamento, volume in vendas_por_mes
            ],
            'top_clientes': [
                {
                    'cliente_id': cliente_id,
                    'nome': nome,
                    'empresa': empresa,
                    'total_pedidos': total_pedidos,
                    'total_gasto': float(total_gasto),
                    'total_kg': float(total_kg)
                }
                for cliente_id, nome, empresa, total_pedidos, total_gasto, total_kg in top_clientes
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@admin_bp.route('/criar-admin', methods=['POST'])
@token_required
@admin_required
def criar_admin(current_user):
    try:
        data = request.get_json()
        
        # Validação
        required_fields = ['email', 'password', 'nome']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se email já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email já cadastrado'}), 400
        
        # Criar usuário admin
        admin = User(
            email=data['email'],
            nome=data['nome'],
            telefone=data.get('telefone'),
            tipo_usuario='admin'
        )
        admin.set_password(data['password'])
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'message': 'Administrador criado com sucesso',
            'admin': admin.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

